/** A centred message for whole-page loading states. */
export function FullPageMessage({ text }: { text: string }) {
  return <div className="grid min-h-screen place-items-center text-muted">{text}</div>;
}
