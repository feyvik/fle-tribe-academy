import { useEffect } from 'react';
import { CERTIFICATE_SETTINGS as settings } from '../data/certificates';
import type { Certificate } from '../data/models';
import { certificateDate } from '../lib/course';
import './Certificate.css';

/**
 * The FLE TRIBE certificate of completion, laid out on A4 landscape like the printed design.
 * Sizes use container units so it scales to any screen and prints at exactly A4.
 */
const CERT_FONTS = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Carlito:wght@400;700&display=swap';

/** The certificate's fonts (web versions of Trajan Pro and Calibri) are only downloaded when a certificate is shown. */
function useCertificateFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${CERT_FONTS}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CERT_FONTS;
    document.head.append(link);
  }, []);
}

export function CertificateCard({ certificate, sample = false }: { certificate: Certificate; sample?: boolean }) {
  useCertificateFonts();
  return (
    <div className="cert-frame">
      <article className="cert" aria-label={`Certificate of completion for ${certificate.full_name}`}>
        <header className="cert-top">
          <img src="/brand/logo.png" alt="FLE TRIBE" width={1200} height={432} decoding="async" className="cert-logo" />
          {settings.partnerLogo && <img className="cert-partner" src={settings.partnerLogo.src} alt={settings.partnerLogo.name} />}
        </header>

        <section className="cert-band">
          <span className="cert-tab cert-tab-top" aria-hidden="true" />
          <span className="cert-tab cert-tab-bottom" aria-hidden="true" />
          <h1 className="cert-title">Certificate</h1>
          <p className="cert-subtitle">of completion</p>
          <p className="cert-presented">Presented to</p>
        </section>

        <section className="cert-body">
          <p className="cert-name">{certificate.full_name}</p>
          <p className="cert-text">
            This certificate is proudly presented to <b>{certificate.full_name}</b> for successfully completing the {settings.duration}
            <br />
            <b>{settings.program}</b> program with <b>The FLE Tribe</b>
          </p>
        </section>

        <footer className="cert-foot">
          <div className="cert-sign">
            {settings.signer.signature && <img className="cert-signature" src={settings.signer.signature} alt="" />}
            <b className="cert-signer">{settings.signer.name}</b>
            <span>{settings.signer.title}</span>
          </div>
          <div className="cert-meta">
            <b>Date: {certificateDate(certificate.issued_on)}</b>
            <b>Certificate No: {certificate.number}</b>
          </div>
        </footer>

        {sample && <div className="cert-watermark" aria-hidden="true">Sample</div>}
      </article>
    </div>
  );
}
