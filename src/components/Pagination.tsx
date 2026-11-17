import { useEffect, useState } from 'react';

/** Splits a list into pages. Goes back to page 1 whenever `resetKey` changes (for example a new filter). */
export function usePagination<T>(items: T[], pageSize = 10, resetKey?: unknown) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => setPage(1), [resetKey]);
  // Stay on a real page if the list shrinks (for example after deleting the last row of the last page).
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    pageCount,
    setPage,
    pageItems: items.slice(start, start + pageSize),
    from: items.length ? start + 1 : 0,
    to: Math.min(start + pageSize, items.length),
    total: items.length,
  };
}

/** Page numbers to show: always the first and last, the current page and its neighbours, with gaps as "…". */
function pageList(page: number, count: number): (number | '…')[] {
  const wanted = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...wanted].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

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
  const button = 'min-w-9 rounded-lg border border-line px-3 py-1.5 font-semibold hover:border-fg disabled:pointer-events-none disabled:opacity-40';
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
                    className={p === page ? `${button} border-brand bg-brand text-white hover:border-brand` : button}>
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
