import { pageList } from '../lib/pagination';

/** "Showing 11–20 of 25" with Previous / page numbers / Next. Hidden when everything fits on one page. */
export function Pagination({ page, pageCount, setPage, from, to, total, label }: {
  page: number;
  pageCount: number;
  setPage: (p: number) => void;
  from: number;
  to: number;
  total: number;
  /** What's being paged, for screen readers, e.g. "Students". */
  label: string;
}) {
  if (pageCount <= 1) return null;
  const button = 'fle-btn fle-btn-secondary fle-btn-sm min-w-9';
  const current = 'fle-btn fle-btn-primary fle-btn-sm min-w-9';
  return (
    <nav aria-label={`${label} pages`} className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="m-0 text-muted">
        Showing <b className="text-fg">{from}–{to}</b> of <b className="text-fg">{total}</b>
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1} className={button}>
          ← Previous
        </button>
        {pageList(page, pageCount).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">…</span>
          ) : (
            <button key={p} type="button" onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined}
                    aria-label={`Page ${p}`}
                    className={p === page ? current : button}>
              {p}
            </button>
          ),
        )}
        <button type="button" onClick={() => setPage(page + 1)} disabled={page === pageCount} className={button}>
          Next →
        </button>
      </div>
    </nav>
  );
}
