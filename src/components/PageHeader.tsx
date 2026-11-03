import type { ReactNode } from 'react';
import { Logo } from './Logo';

/**
 * The bold FLE TRIBE page header: a purple band with lime corner tabs, a lime label and a big title,
 * echoing the certificate and the Forge · Learn · Evolve poster. Used at the top of every page.
 */
export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
  tone = 'brand',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Text under the title. */
  children?: ReactNode;
  /** Buttons shown on the right (stacked under the text on phones). */
  actions?: ReactNode;
  /** 'coral' for assignment days, 'ink' for review days. */
  tone?: 'brand' | 'coral' | 'ink';
}) {
  const bg = { brand: 'bg-brand', coral: 'bg-[#c23a37]', ink: 'bg-ink' }[tone];
  return (
    <header className={`relative mb-8 overflow-clip rounded-2xl ${bg} px-6 pb-8 pt-8 text-white sm:px-9 sm:pb-10 sm:pt-10`}>
      <span className="absolute left-0 top-0 h-2.5 w-24 rounded-br-full bg-lime sm:w-36" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 h-2.5 w-24 rounded-tl-full bg-lime sm:w-36" aria-hidden="true" />
      <Logo variant="icon" tone="white" decorative className="pointer-events-none absolute -bottom-10 -right-8 h-48 opacity-[0.07] sm:h-60" />
      <div className="relative flex flex-wrap items-end justify-between gap-5">
        <div className="grid max-w-3xl gap-3">
          {eyebrow && <div className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-lime">{eyebrow}</div>}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          {children && <div className="max-w-[65ch] text-base text-white/85 sm:text-lg">{children}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/** Lime call-to-action button style for use on purple. */
export const limeButton = 'inline-flex items-center rounded-lg bg-lime px-5 py-2.5 font-bold text-ink hover:brightness-95';
/** Outline button style for use on purple. */
export const ghostButton = 'inline-flex items-center rounded-lg border border-white/40 px-5 py-2.5 font-semibold text-white hover:bg-white/10';
