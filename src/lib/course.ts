import { PHASES, WEEKS } from '../data/curriculum';
import type { DayKey, Week } from '../data/models';

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const DAY_NAMES: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

export const phases = PHASES;
const byId = new Map(WEEKS.map((w) => [w.id, w]));

/** Weeks in teaching order. Must match course_lessons in the Supabase migration. */
export const weekOrder: string[] = PHASES.flatMap((p) => p.weekIds);

/** Every day of every course in order: the main course first, then the bonus courses. */
export const allDays: { weekId: string; day: DayKey }[] = weekOrder.flatMap((weekId) =>
  DAY_KEYS.map((day) => ({ weekId, day })),
);

export const isBonus = (weekId: string) => byId.get(weekId)?.track === 'bonus';

/** The main course: what students must finish for their certificate. Must match course_lessons in Supabase. */
export const mainDays = allDays.filter((d) => !isBonus(d.weekId));
export const bonusWeekIds = weekOrder.filter(isBonus);

export const lessonKey = (weekId: string, day: DayKey) => `${weekId}-${day}`;

export function getWeek(id: string): Week | undefined {
  return byId.get(id);
}

export function weekLabel(week: Week): string {
  return week.track === 'bonus' ? `Bonus: ${week.title}` : `Week ${week.number}`;
}

/** Full heading: "Week 07: Bootstrap…" or "Bonus: TypeScript". */
export function weekHeading(week: Week): string {
  return week.track === 'bonus' ? weekLabel(week) : `${weekLabel(week)}: ${week.title}`;
}

/** Short label for menus: "W07", or "B1" for bonus courses. */
export function shortLabel(week: Week): string {
  return week.track === 'bonus' ? week.number : `W${week.number}`;
}

export function dayLabel(weekId: string, day: DayKey): string {
  const w = getWeek(weekId);
  return w ? `${weekLabel(w)} · ${DAY_NAMES[day]}` : `${weekId} · ${day}`;
}

export function neighbour(weekId: string, day: DayKey, step: 1 | -1) {
  const i = allDays.findIndex((d) => d.weekId === weekId && d.day === day);
  return allDays[i + step];
}

/** Title and questions for a lesson key like "w3-fri", as shown to admins reviewing answers. */
export function lessonInfo(key: string) {
  const [weekId, day] = key.split('-') as [string, DayKey];
  const week = getWeek(weekId);
  if (!week) return { label: key, title: key, questions: [] as string[] };
  const label = dayLabel(weekId, day);
  if (day === 'fri') return { label, title: `Assignment: ${week.assignment.title}`, questions: ['Notes for the reviewer'] };
  if (day === 'sat') return { label, title: 'Weekly reflection', questions: week.review.questions };
  const lesson = week.lessons.find((l) => l.day === day);
  return { label, title: lesson?.title ?? key, questions: lesson?.research ?? [] };
}

/** "2025-11-30" → "30th November 2025", matching the printed certificates. */
export function certificateDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  return `${day}${suffix} ${d.toLocaleString('en-GB', { month: 'long' })} ${d.getFullYear()}`;
}

export function formatDateTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/** Pulls the 11-character video id out of any common YouTube link, or accepts a bare id. */
export function youtubeId(value: string): string | null {
  const v = value.trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  const match = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return match ? match[1] : null;
}
