const URL_RE = /(https?:\/\/[^\s<>"')]+)/g;

/** Shows plain text with any web addresses turned into links that open in a new tab. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-accent underline hover:no-underline">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** A list of links, each shown as its address, opening in a new tab. */
export function LinkList({ links }: { links: string[] }) {
  return (
    <ul className="m-0 grid list-none gap-1 p-0">
      {links.map((l, i) => (
        <li key={i}>
          <a href={l} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-accent hover:underline">{l} ↗</a>
        </li>
      ))}
    </ul>
  );
}
