/**
 * The official FLE TRIBE logo files (from The FLE Tribe/PNG), served from public/brand/.
 * variant 'full' = mark + "FLE TRIBE" wordmark, 'icon' = mark only.
 * tone 'color' = purple mark + grey wordmark, 'white' = all white for purple or dark backgrounds.
 */
export function Logo({
  variant = 'full',
  tone = 'color',
  className = '',
}: {
  variant?: 'full' | 'icon';
  tone?: 'color' | 'white';
  className?: string;
}) {
  const src =
    variant === 'icon'
      ? tone === 'white' ? '/brand/icon-white.png' : '/brand/icon.png'
      : tone === 'white' ? '/brand/logo-white.png' : '/brand/logo.png';
  return <img src={src} alt="FLE TRIBE" className={`block w-auto ${className}`} />;
}

/** Full logo that switches to the white version in dark mode. */
export function ThemedLogo({ className = '' }: { className?: string }) {
  return (
    <picture className="block">
      <source srcSet="/brand/logo-white.png" media="(prefers-color-scheme: dark)" />
      <img src="/brand/logo.png" alt="FLE TRIBE" className={`block w-auto ${className}`} />
    </picture>
  );
}
