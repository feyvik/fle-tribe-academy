/** A centred message for whole-page loading states, with an optional action (e.g. "Try again"). */
export function FullPageMessage({ text, action }: { text: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center text-muted">
      <div className="grid justify-items-center gap-4">
        <p className="m-0">{text}</p>
        {action && <button type="button" onClick={action.onClick} className="fle-btn fle-btn-primary fle-btn-md">{action.label}</button>}
      </div>
    </div>
  );
}
