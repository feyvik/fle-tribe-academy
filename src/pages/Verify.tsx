import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CertificateCard } from '../components/CertificateCard';
import { ThemedLogo } from '../components/Logo';
import { SAMPLE_CERTIFICATE } from '../data/certificates';
import type { Certificate } from '../data/models';
import { supabase } from '../lib/supabase';

/** Public page at /verify/:number. Shows a certificate so anyone can confirm it, and lets the owner save it as PDF. */
export default function Verify() {
  const { number = '' } = useParams();
  const isSample = number.toLowerCase() === 'sample';
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [state, setState] = useState<'loading' | 'found' | 'missing' | 'error'>('loading');

  useEffect(() => {
    if (isSample) {
      setCertificate(SAMPLE_CERTIFICATE);
      setState('found');
      document.title = 'Sample certificate · FLE TRIBE';
      return;
    }
    setState('loading');
    supabase.rpc('verify_certificate', { p_number: number }).then(({ data, error }) => {
      if (error) return setState('error');
      const c = (data as Certificate[] | null)?.[0];
      if (!c) return setState('missing');
      setCertificate(c);
      setState('found');
      document.title = `${c.full_name} · Certificate · FLE TRIBE`;
    });
  }, [number, isSample]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 print:max-w-none print:p-0">
      <header className="no-print mb-8 flex items-center justify-between gap-4">
        <Link to="/" aria-label="FLE TRIBE home"><ThemedLogo className="h-10" /></Link>
        <span className="font-display text-sm font-semibold text-muted">Certificate verification</span>
      </header>

      {state === 'loading' && <p className="text-muted">Checking certificate…</p>}
      {state === 'error' && <p className="font-semibold text-fri">Couldn't check this certificate right now. Refresh the page to try again.</p>}
      {state === 'missing' && (
        <div className="grid max-w-xl gap-3">
          <h1 className="text-3xl font-extrabold">Certificate not found</h1>
          <p className="text-muted">
            No FLE TRIBE certificate has the number <b className="font-mono text-fg">{number}</b>. Check the number on the certificate
            (for example FTL26FE-001), or contact FLE TRIBE to confirm it.
          </p>
        </div>
      )}
      {state === 'found' && certificate && (
        <>
          <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
            {isSample ? (
              <p className="m-0 font-semibold">Sample design. Real certificates show the student's name and number.</p>
            ) : (
              <p className="m-0 flex items-center gap-2 font-semibold">
                <span className="inline-grid size-6 place-items-center rounded-full bg-lime text-sm text-ink" aria-hidden="true">✓</span>
                Verified: FLE TRIBE issued this certificate to {certificate.full_name}.
              </p>
            )}
            <button type="button" onClick={() => window.print()} className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90">
              Download PDF
            </button>
          </div>
          <CertificateCard certificate={certificate} sample={isSample} />
          <p className="no-print mt-4 text-sm text-muted">
            "Download PDF" opens the print dialog: choose <b>Save as PDF</b>, landscape, and turn on <b>Background graphics</b>. To share
            it, copy this page's address.
          </p>
        </>
      )}
    </div>
  );
}
