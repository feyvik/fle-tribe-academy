import { useEffect, useState } from 'react';
import type { LessonMedia } from '../data/models';
import { youtubeId } from '../lib/course';
import { MEDIA_BUCKET, supabase } from '../lib/supabase';

/** Short-lived link to a private file in the lesson-media bucket (only works for unlocked lessons). */
function useSignedUrl(path: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setUrl(null);
    setFailed(false);
    if (!path) return;
    supabase.storage
      .from(MEDIA_BUCKET)
      .createSignedUrl(path, 60 * 60 * 4)
      .then(({ data, error }) => (error || !data ? setFailed(true) : setUrl(data.signedUrl)));
  }, [path]);
  return { url, failed };
}

/** A lesson's YouTube video, uploaded video or PDF, or a "coming soon" placeholder. */
export function MediaPlayer({ media }: { media?: LessonMedia }) {
  const filePath = media && media.kind !== 'youtube' ? media.url : null;
  const { url: fileUrl, failed } = useSignedUrl(filePath);

  if (!media) {
    return (
      <div className="grid aspect-video max-h-72 w-full place-items-center rounded-xl border border-dashed border-line bg-sunk text-center">
        <div>
          <div className="eyebrow">Lesson media</div>
          <p className="mt-1 text-muted">Video coming soon</p>
        </div>
      </div>
    );
  }

  if (media.kind === 'youtube') {
    const id = youtubeId(media.url);
    return (
      <figure className="m-0">
        {media.title && <figcaption className="mb-2 font-semibold">{media.title}</figcaption>}
        {id ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
              title={media.title || 'Lesson video'}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="rounded-xl border border-fri bg-fri-soft p-4 text-sm">
            This lesson's YouTube link can't be played. An admin needs to update it under Admin → Lesson media.
          </p>
        )}
      </figure>
    );
  }

  if (failed) {
    return <p className="rounded-xl bg-fri-soft p-4 text-sm font-semibold text-fri">This file couldn't be loaded. Refresh the page to try again.</p>;
  }
  if (!fileUrl) return <div className="aspect-video w-full animate-pulse rounded-xl bg-sunk" aria-label="Loading" />;

  if (media.kind === 'video') {
    return (
      <figure className="m-0">
        {media.title && <figcaption className="mb-2 font-semibold">{media.title}</figcaption>}
        <video className="aspect-video w-full rounded-xl bg-black" src={fileUrl} controls preload="metadata" playsInline />
      </figure>
    );
  }

  return (
    <figure className="m-0">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <figcaption className="font-semibold">{media.title || 'Lesson PDF'}</figcaption>
        <div className="flex gap-2 text-sm font-semibold">
          <a href={fileUrl} target="_blank" rel="noopener" className="rounded-lg border border-line bg-surface px-3 py-1.5 hover:border-fg">
            Open in new tab ↗
          </a>
          <a href={`${fileUrl}&download=`} className="rounded-lg bg-fg px-3 py-1.5 text-bg hover:opacity-90">Download</a>
        </div>
      </div>
      <iframe className="h-[75vh] min-h-[420px] w-full rounded-xl border border-line bg-surface" src={`${fileUrl}#view=FitH`} title={media.title || 'Lesson PDF'} />
      <p className="mt-2 text-sm text-muted">If the PDF doesn't show on your phone, use "Open in new tab".</p>
    </figure>
  );
}
