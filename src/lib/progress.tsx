import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DayKey, LessonMedia, Submission } from '../data/models';
import { useAuth } from './auth';
import { DAY_KEYS, isBonus, lessonKey, mainDays } from './course';
import { supabase } from './supabase';

interface ProgressState {
  loading: boolean;
  /** Days of the main course submitted, out of totalCount. Bonus courses don't count. */
  completedCount: number;
  totalCount: number;
  /** Every main-course day is submitted, so bonus courses are open. */
  mainComplete: boolean;
  percent: number;
  /** The main-course day to work on next (undefined once the main course is complete). */
  nextUp: { weekId: string; day: DayKey } | undefined;
  submission: (weekId: string, day: DayKey) => Submission | undefined;
  isDone: (weekId: string, day: DayKey) => boolean;
  isUnlocked: (weekId: string, day: DayKey) => boolean;
  weekUnlocked: (weekId: string) => boolean;
  weekDone: (weekId: string) => boolean;
  media: (key: string) => LessonMedia | undefined;
  submit: (weekId: string, day: DayKey, answers: string[], link?: string, links?: string[]) => Promise<Submission>;
}

const ProgressContext = createContext<ProgressState | null>(null);

/**
 * The signed-in student's submissions and the lesson media they can see.
 * Days open in order: everything up to the first unsubmitted day. Supabase enforces the same rule.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { profile, isAdmin } = useAuth();
  const [subs, setSubs] = useState<Record<string, Submission>>({});
  const [mediaRows, setMediaRows] = useState<Record<string, LessonMedia>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    Promise.all([
      supabase.from('submissions').select('*').eq('user_id', profile.id),
      supabase.from('lesson_media').select('*'), // row level security only returns unlocked lessons
    ]).then(([s, m]) => {
      if (cancelled) return;
      setSubs(Object.fromEntries(((s.data ?? []) as Submission[]).map((x) => [x.lesson_key, x])));
      setMediaRows(Object.fromEntries(((m.data ?? []) as LessonMedia[]).map((x) => [x.lesson_key, x])));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [profile]);

  // Media becomes visible as lessons unlock, so reload it whenever progress grows.
  const completedCount = Object.keys(subs).length;
  useEffect(() => {
    if (!profile || loading) return;
    supabase
      .from('lesson_media')
      .select('*')
      .then(({ data }) => setMediaRows(Object.fromEntries(((data ?? []) as LessonMedia[]).map((x) => [x.lesson_key, x]))));
  }, [completedCount, profile, loading]);

  // Main course: days open in order, up to the first one not yet submitted.
  const frontier = useMemo(() => {
    const i = mainDays.findIndex((d) => !subs[lessonKey(d.weekId, d.day)]);
    return i === -1 ? mainDays.length : i;
  }, [subs]);
  const mainComplete = frontier === mainDays.length;
  const mainDone = useMemo(() => mainDays.filter((d) => subs[lessonKey(d.weekId, d.day)]).length, [subs]);

  const isUnlocked = useCallback(
    (weekId: string, day: DayKey) => {
      if (isAdmin) return true; // admins preview every lesson
      if (isBonus(weekId)) {
        // Bonus courses open after the main course; inside each one, days open in order.
        if (!mainComplete) return false;
        const firstOpen = DAY_KEYS.findIndex((d) => !subs[lessonKey(weekId, d)]);
        return DAY_KEYS.indexOf(day) <= (firstOpen === -1 ? DAY_KEYS.length : firstOpen);
      }
      const i = mainDays.findIndex((d) => d.weekId === weekId && d.day === day);
      return i !== -1 && i <= frontier;
    },
    [frontier, mainComplete, subs, isAdmin],
  );

  const submit = useCallback(
    async (weekId: string, day: DayKey, answers: string[], link?: string, links: string[] = []) => {
      const key = lessonKey(weekId, day);
      const existing = subs[key];
      const fields: Record<string, unknown> = { answers, link: link || null, submitted_at: new Date().toISOString() };
      // Only send links when there are some (or some are being removed), so answers still save before update 0002 is applied.
      if (links.length || existing?.links?.length) fields.links = links;
      const { data, error } = existing
        ? await supabase.from('submissions').update(fields).eq('id', existing.id).select().single()
        : await supabase.from('submissions').insert({ ...fields, lesson_key: key, user_id: profile!.id }).select().single();
      if (error) throw error;
      if (!data) throw new Error('This work has already been reviewed, so it can no longer be changed.');
      setSubs((s) => ({ ...s, [key]: data as Submission }));
      return data as Submission;
    },
    [subs, profile],
  );

  const value: ProgressState = {
    loading,
    completedCount: mainDone,
    totalCount: mainDays.length,
    percent: Math.round((mainDone / mainDays.length) * 100),
    mainComplete,
    nextUp: mainDays[frontier],
    submission: (w, d) => subs[lessonKey(w, d)],
    isDone: (w, d) => !!subs[lessonKey(w, d)],
    isUnlocked,
    weekUnlocked: (w) => isUnlocked(w, 'mon'),
    weekDone: (w) => DAY_KEYS.every((d) => !!subs[lessonKey(w, d)]),
    media: (key) => mediaRows[key],
    submit,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
