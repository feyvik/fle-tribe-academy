import { useEffect, useState } from 'react';
import type { Submission } from '../../data/models';
import { errorText, supabase } from '../../lib/supabase';
import { SubmissionReview } from './shared';
import { PageHeader } from '../../components/PageHeader';

type Row = Submission & { profiles: { full_name: string } | null };

/** Every student's answers, newest first. Defaults to those still waiting for feedback. */
export default function Submissions() {
  const [status, setStatus] = useState<'pending' | 'all'>('pending');
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Submissions · Admin · FLE TRIBE';
    setLoading(true);
    let q = supabase.from('submissions').select('*, profiles(full_name)').order('submitted_at', { ascending: false }).limit(200);
    if (status === 'pending') q = q.is('reviewed_at', null);
    q.then(({ data, error }) => {
      if (error) setError(errorText(error));
      else setItems((data ?? []) as Row[]);
      setLoading(false);
    });
  }, [status]);

  const tab = (active: boolean) => `rounded-md px-3 py-1.5 ${active ? 'bg-lime text-ink' : 'text-white/80 hover:text-white'}`;
  return (
    <>
      <PageHeader eyebrow="Admin" title="Submissions" actions={
        <div className="flex rounded-lg bg-white/10 p-1 text-sm font-semibold" role="group" aria-label="Filter">
          <button type="button" onClick={() => setStatus('pending')} className={tab(status === 'pending')}>Needs review</button>
          <button type="button" onClick={() => setStatus('all')} className={tab(status === 'all')}>All</button>
        </div>
      }>
        Answers, assignments and reflections from students. Feedback appears on the student's lesson.
      </PageHeader>

      {loading ? (
        <p className="text-muted">Loading submissions…</p>
      ) : error ? (
        <p className="font-semibold text-fri">{error}</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">
          {status === 'pending' ? 'All caught up. Nothing is waiting for feedback.' : 'No submissions yet.'}
        </p>
      ) : (
        <div className="grid gap-4">
          {items.map((s) => (
            <SubmissionReview key={s.id} submission={s} student={{ id: s.user_id, name: s.profiles?.full_name ?? 'Student' }}
                              onReviewed={(u) => setItems((list) => list.map((x) => (x.id === u.id ? { ...u, profiles: x.profiles } : x)))} />
          ))}
        </div>
      )}
    </>
  );
}
