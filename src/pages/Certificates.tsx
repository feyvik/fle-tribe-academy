import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CertificateCard } from '../components/CertificateCard';
import { SAMPLE_CERTIFICATE } from '../data/certificates';
import type { Certificate } from '../data/models';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { PageHeader } from '../components/PageHeader';

/** The student's own certificate (once issued), how to earn it, and a lookup by number. */
export default function Certificates() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mine, setMine] = useState<Certificate[]>([]);
  const [number, setNumber] = useState('');

  useEffect(() => {
    document.title = 'Certificates · FLE TRIBE';
    if (!profile || isAdmin) return;
    supabase.from('certificates').select('number, full_name, issued_on').eq('user_id', profile.id)
      .then(({ data }) => setMine((data ?? []) as Certificate[]));
  }, [profile, isAdmin]);

  function find(e: FormEvent) {
    e.preventDefault();
    if (number.trim()) navigate(`/verify/${encodeURIComponent(number.trim().toUpperCase())}`);
  }

  return (
    <>
      <PageHeader eyebrow="After the program" title="Certificate of completion">
        Every student who completes the Frontend Developer Program receives a FLE TRIBE certificate with its own certificate number.
        Anyone can open the certificate link to confirm it is genuine.
      </PageHeader>

      {mine.map((c) => (
        <section key={c.number} className="mb-8 rounded-2xl bg-brand p-6 text-white">
          <div className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-lime">Your certificate is ready</div>
          <p className="mt-2 text-2xl font-extrabold">Congratulations, {c.full_name}.</p>
          <p className="mt-1 text-white/80">Certificate No: <b className="font-mono text-white">{c.number}</b></p>
          <Link to={`/verify/${c.number}`} className="mt-4 inline-block rounded-lg bg-lime px-5 py-3 font-bold text-ink">View, download and share →</Link>
        </section>
      ))}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-6">
          <h2 className="mb-3 text-lg font-bold">How to earn it</h2>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Submit every lesson, assignment and reflection in the main course (Weeks 00–19). Each one unlocks the next. Bonus courses are optional.</li>
            <li>Attend the Saturday reviews and explain your work.</li>
            <li>Ship the Week 18 capstone and present it on demo day.</li>
            <li>Get feedback on all your work. Once FLE TRIBE has reviewed every day, your certificate is issued automatically, emailed to you and shown on this page.</li>
          </ol>
        </section>
        <section className="rounded-xl border border-line bg-surface p-6">
          <h2 className="mb-3 text-lg font-bold">Verify a certificate</h2>
          <form className="grid gap-3" onSubmit={find}>
            <label htmlFor="cert-number" className="text-sm font-semibold">Certificate number</label>
            <div className="flex flex-wrap gap-2">
              <input id="cert-number" autoComplete="off" placeholder="FTL26FE-001" value={number} onChange={(e) => setNumber(e.target.value)}
                     className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2.5 font-mono uppercase" />
              <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90">Verify</button>
            </div>
          </form>
        </section>
      </div>

      <section className="mt-10">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">What it looks like</h2>
          <Link to="/verify/sample" className="text-sm font-semibold text-accent hover:underline">Open the full-size sample →</Link>
        </div>
        <Link to="/verify/sample" className="block max-w-3xl" aria-label="Open the sample certificate">
          <CertificateCard certificate={SAMPLE_CERTIFICATE} sample />
        </Link>
      </section>
    </>
  );
}
