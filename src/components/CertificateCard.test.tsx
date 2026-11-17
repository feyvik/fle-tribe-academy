import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CertificateCard } from './CertificateCard';

const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

describe('CertificateCard', () => {
  it('shows the app course by default, without repeating "program"', () => {
    const html = renderToStaticMarkup(<CertificateCard certificate={{ number: 'FTL26FE-001', full_name: 'Ada Obi', issued_on: '2026-11-30' }} />);
    expect(text(html)).toContain('5 month Frontend Developer Program with The FLE Tribe');
    expect(text(html)).not.toMatch(/Program program/i);
  });

  it('shows another program, its length and partner logo when the certificate has them', () => {
    const html = renderToStaticMarkup(
      <CertificateCard certificate={{ number: 'FT25DA-003', full_name: 'Fawass Olalekan Adelabu', issued_on: '2025-07-30', program: 'Data Analysis Program', duration: '4 month', partner: 'Startup Graveyard' }} />,
    );
    expect(text(html)).toContain('4 month Data Analysis Program with The FLE Tribe');
    expect(html).toContain('alt="Startup Graveyard"');
    expect(text(html)).toContain('30th July 2025');
  });
});
