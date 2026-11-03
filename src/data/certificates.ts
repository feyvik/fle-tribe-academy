import type { Certificate } from './models';

/**
 * Text printed on every certificate. Certificates themselves are issued by admins in the app
 * (Admin → Certificates) and numbered automatically: FTL<yy>FE-<nnn>, e.g. FTL26FE-001.
 */
export const CERTIFICATE_SETTINGS = {
  program: 'Frontend Developer Program',
  /** Printed as "... completing the <duration> <program> program". */
  duration: '5 month',
  signer: { name: 'Favour Vivian Woka', title: 'Founder FLE TRIBE LTD', /** e.g. '/brand/signature.png' */ signature: '' },
  /** Optional partner logo shown top right, e.g. { src: '/brand/partner.png', name: 'Partner' }. */
  partnerLogo: null as { src: string; name: string } | null,
};

/** Shown at /verify/sample with a "SAMPLE" watermark, to preview the design. */
export const SAMPLE_CERTIFICATE: Certificate = {
  number: 'FTL26FE-000',
  full_name: 'Student Full Name',
  issued_on: '2026-11-30',
};
