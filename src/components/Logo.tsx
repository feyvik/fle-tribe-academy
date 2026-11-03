/**
 * The official FLE TRIBE logo files (from The FLE Tribe/PNG), served from public/brand/.
 * variant 'full' = mark + "FLE TRIBE" wordmark, 'icon' = mark only.
 * tone 'color' = purple mark + grey wordmark, 'white' = all white for purple or dark backgrounds.
 * Width and height are set so the page doesn't jump while the image loads; CSS sets the displayed size.
 */
const SIZES = { full: { width: 1200, height: 432 }, icon: { width: 512, height: 508 } };

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
  const src =
    variant === 'icon'
      ? tone === 'white' ? '/brand/icon-white.png' : '/brand/icon.png'
      : tone === 'white' ? '/brand/logo-white.png' : '/brand/logo.png';
  return (
    <img
      src={src}
      alt={decorative ? '' : 'FLE TRIBE'}
      aria-hidden={decorative || undefined}
      {...SIZES[variant]}
      loading={decorative ? 'lazy' : undefined}
      decoding="async"
      className={`block w-auto ${className}`}
    />
  );
}

/** Full logo that switches to the white version in dark mode. */
export function ThemedLogo({ className = '' }: { className?: string }) {
  return (
    <picture className="block">
      <source srcSet="/brand/logo-white.png" media="(prefers-color-scheme: dark)" />
      <img src="/brand/logo.png" alt="FLE TRIBE" {...SIZES.full} decoding="async" className={`block w-auto ${className}`} />
    </picture>
  );
}
