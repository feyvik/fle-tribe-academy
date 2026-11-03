import { useEffect, useState } from 'react';
import type { LessonMedia } from '../../data/models';
import { getWeek, shortLabel, weekHeading, weekOrder } from '../../lib/course';
import { MEDIA_BUCKET, errorText, supabase } from '../../lib/supabase';

const ALLOWED: Record<string, { kind: 'video' | 'pdf'; ext: string }> = {
  'application/pdf': { kind: 'pdf', ext: 'pdf' },
  'video/mp4': { kind: 'video', ext: 'mp4' },
  'video/webm': { kind: 'video', ext: 'webm' },
  'video/quicktime': { kind: 'video', ext: 'mov' },
};
const YOUTUBE = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/\S+$/i;

/** Attach a YouTube video, uploaded video or PDF to each lesson (Mon–Thu) and assignment (Fri). */
export default function Content() {
  const [weekId, setWeekId] = useState('w0');
  const [media, setMedia] = useState<Record<string, LessonMedia>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Lesson media · Admin · FLE TRIBE';
    supabase.from('lesson_media').select('*').then(({ data, error }) => {
      if (error) setError(errorText(error));
      else setMedia(Object.fromEntries(((data ?? []) as LessonMedia[]).map((m) => [m.lesson_key, m])));
    });
  }, []);

  const week = getWeek(weekId)!;
  const count = (id: string) => ['mon', 'tue', 'wed', 'thu', 'fri'].filter((d) => media[`${id}-${d}`]).length;
  const update = (key: string, m: LessonMedia | null) =>
    setMedia((all) => {
      const next = { ...all };
      if (m) next[key] = m;
      else delete next[key];
      return next;
    });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Lesson media</h1>
        <p className="mt-1 text-muted">Each lesson shows one YouTube video, uploaded video or PDF. Fridays can carry the assignment brief.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-1.5" role="tablist" aria-label="Weeks">
        {weekOrder.map((id) => {
          const w = getWeek(id)!;
          return (
            <button key={id} type="button" role="tab" aria-selected={weekId === id} onClick={() => setWeekId(id)}
                    className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold ${weekId === id ? 'bg-brand text-white' : 'border border-line bg-surface hover:border-fg'}`}>
              {shortLabel(w)} <span className="ml-1 opacity-70">{count(id)}/5</span>
            </button>
          );
        })}
      </div>

      {error && <p className="mb-4 font-semibold text-fri">{error}</p>}

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <h2 className="border-b border-line px-4 py-3 text-lg font-bold">{weekHeading(week)}</h2>
        <div className="divide-y divide-line">
          {week.lessons.map((l) => (
            <MediaRow key={l.id} lessonKey={l.id} day={l.day.toUpperCase()} title={l.title} media={media[l.id]} onChange={(m) => update(l.id, m)} />
          ))}
          <MediaRow key={week.assignment.id} lessonKey={week.assignment.id} day="FRI" title={`Assignment: ${week.assignment.title}`}
                    media={media[week.assignment.id]} onChange={(m) => update(week.assignment.id, m)} />
        </div>
      </section>
    </>
  );
}

/** One lesson's slot: what's attached, and a form to set a YouTube link or upload a file. */
function MediaRow({ lessonKey, day, title, media, onChange }: {
  lessonKey: string;
  day: string;
  title: string;
  media?: LessonMedia;
  onChange: (m: LessonMedia | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [source, setSource] = useState<'youtube' | 'file'>('youtube');
  const [url, setUrl] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function removeStoredFile(m?: LessonMedia) {
    if (m && m.kind !== 'youtube') await supabase.storage.from(MEDIA_BUCKET).remove([m.url]);
  }

  async function open(m: LessonMedia) {
    if (m.kind === 'youtube') return window.open(m.url, '_blank', 'noopener');
    const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(m.url, 600);
    if (data) window.open(data.signedUrl, '_blank', 'noopener');
  }

  async function save() {
    setError('');
    let row: Omit<LessonMedia, 'lesson_key'>;
    setBusy(true);
    try {
      if (source === 'youtube') {
        if (!YOUTUBE.test(url.trim())) throw new Error('Paste a YouTube link, for example https://www.youtube.com/watch?v=…');
        row = { kind: 'youtube', url: url.trim(), title: mediaTitle.trim() || null };
      } else {
        if (!file) throw new Error('Choose a file to upload.');
        const type = ALLOWED[file.type];
        if (!type) throw new Error('Choose a PDF or a video file (MP4, WebM or MOV).');
        const path = `${lessonKey}/${crypto.randomUUID()}.${type.ext}`;
        const up = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type });
        if (up.error) throw new Error(/exceeded|too large|413/i.test(up.error.message) ? 'That file is too large for your Supabase storage limit.' : up.error.message);
        row = { kind: type.kind, url: path, title: mediaTitle.trim() || null };
      }
      const { data, error } = await supabase
        .from('lesson_media')
        .upsert({ lesson_key: lessonKey, ...row, updated_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      await removeStoredFile(media); // the replaced file
      onChange(data as LessonMedia);
      setEditing(false);
      setUrl('');
      setMediaTitle('');
      setFile(null);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const { error } = await supabase.from('lesson_media').delete().eq('lesson_key', lessonKey);
    if (error) return setError(errorText(error));
    await removeStoredFile(media);
    onChange(null);
    setConfirmRemove(false);
  }

  const tab = (active: boolean) => `rounded-md px-3 py-1.5 ${active ? 'bg-surface shadow-sm' : 'text-muted'}`;
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-[88px_minmax(0,1fr)]">
      <span className={`font-mono text-[13px] font-semibold tracking-wider ${day === 'FRI' ? 'text-fri' : 'text-accent'}`}>{day}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-bold">{title}</div>
            {media ? (
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-sat-soft px-2.5 py-0.5 text-xs font-bold text-sat">
                  {media.kind === 'youtube' ? 'YouTube' : media.kind === 'video' ? 'Video file' : 'PDF'}
                </span>
                <button type="button" onClick={() => open(media)} className="truncate font-semibold text-accent hover:underline">{media.title || 'Open ↗'}</button>
              </div>
            ) : (
              <div className="mt-1 text-sm text-muted">Nothing attached. Students see "coming soon".</div>
            )}
          </div>
          {!editing && (
            <div className="flex gap-2 text-sm font-semibold">
              <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-line px-3 py-1.5 hover:border-fg">
                {media ? 'Replace' : 'Add video or PDF'}
              </button>
              {media && (confirmRemove ? (
                <>
                  <button type="button" onClick={remove} className="rounded-lg bg-fri px-3 py-1.5 text-white">Confirm remove</button>
                  <button type="button" onClick={() => setConfirmRemove(false)} className="px-2 py-1.5 text-muted">Keep</button>
                </>
              ) : (
                <button type="button" onClick={() => setConfirmRemove(true)} className="px-2 py-1.5 text-fri">Remove</button>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <div className="mt-4 grid gap-4 rounded-lg bg-sunk p-4">
            <div className="flex gap-1 text-sm font-semibold" role="tablist">
              <button type="button" role="tab" aria-selected={source === 'youtube'} onClick={() => setSource('youtube')} className={tab(source === 'youtube')}>YouTube link</button>
              <button type="button" role="tab" aria-selected={source === 'file'} onClick={() => setSource('file')} className={tab(source === 'file')}>Upload video or PDF</button>
            </div>
            <div className="grid gap-1.5">
              <label htmlFor={`${lessonKey}-title`} className="text-sm font-semibold">Title <span className="font-normal text-muted">(optional)</span></label>
              <input id={`${lessonKey}-title`} placeholder="e.g. How DNS works" value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)}
                     className="rounded-lg border border-line bg-surface px-3 py-2" />
            </div>
            {source === 'youtube' ? (
              <div className="grid gap-1.5">
                <label htmlFor={`${lessonKey}-url`} className="text-sm font-semibold">YouTube link</label>
                <input id={`${lessonKey}-url`} placeholder="https://www.youtube.com/watch?v=…" value={url} onChange={(e) => setUrl(e.target.value)}
                       className="rounded-lg border border-line bg-surface px-3 py-2" />
              </div>
            ) : (
              <div className="grid gap-1.5">
                <label htmlFor={`${lessonKey}-file`} className="text-sm font-semibold">File</label>
                <input id={`${lessonKey}-file`} type="file" accept="application/pdf,video/mp4,video/webm,video/quicktime" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                       className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-2 file:font-semibold file:text-white" />
                <span className="text-xs text-muted">PDF, MP4, WebM or MOV. Large videos can take a few minutes; keep this page open.</span>
              </div>
            )}
            {error && <p className="m-0 text-sm font-semibold text-fri" role="alert">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={save} disabled={busy} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {busy ? (source === 'file' ? 'Uploading…' : 'Saving…') : 'Save'}
              </button>
              <button type="button" onClick={() => { setEditing(false); setError(''); }} disabled={busy} className="text-sm font-semibold text-muted">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
