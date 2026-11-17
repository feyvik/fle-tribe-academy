/**
 * The FLE TRIBE logos from the brand kit (fle-tribe-brand-kit/assets/logos), served from public/brand/ as SVG.
 * variant 'full' = mark with the stacked "FLE TRIBE" wordmark (the kit's primary logo), 'icon' = mark only.
 * tone 'color' = brand-blue mark + raisin wordmark, 'white' = all white, for brand-blue or dark backgrounds.
 * Width and height match each SVG's shape so the page doesn't jump while it loads; CSS sets the displayed size.
 * (Emails and the printed certificate keep the PNG versions, because many email apps can't show SVG.)
 */
const FILES = {
  full: { color: '/brand/fle-tribe-logo-primary.svg', white: '/brand/fle-tribe-logo-primary-white.svg', width: 260, height: 95 },
  icon: { color: '/brand/fle-tribe-mark.svg', white: '/brand/fle-tribe-mark-white.svg', width: 96, height: 95 },
};

export function Logo({
  variant = 'full',
  tone = 'color',
  className = '',
  decorative = false,
}: {
  variant?: 'full' | 'icon';
  tone?: 'color' | 'white';
  className?: string;
  /** Background watermark: hidden from screen readers and loaded lazily. */
  decorative?: boolean;
}) {
  const file = FILES[variant];
  return (
    <img
      src={file[tone]}
      alt={decorative ? '' : 'FLE TRIBE'}
      aria-hidden={decorative || undefined}
      width={file.width}
      height={file.height}
      loading={decorative ? 'lazy' : undefined}
      decoding="async"
      className={`block w-auto ${className}`}
    />
  );
}

/** Full logo that switches to the white version in dark mode, as the brand kit asks. */
export function ThemedLogo({ className = '' }: { className?: string }) {
  const file = FILES.full;
  return (
    <picture className="block">
      <source srcSet={file.white} media="(prefers-color-scheme: dark)" />
      <img src={file.color} alt="FLE TRIBE" width={file.width} height={file.height} decoding="async" className={`block w-auto ${className}`} />
    </picture>
  );
}
