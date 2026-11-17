import { describe, expect, it } from 'vitest';
import { pageList } from './pagination';

describe('pageList', () => {
  it('shows every page when there are only a few', () => {
    expect(pageList(2, 3)).toEqual([1, 2, 3]);
  });

  it('shortens long lists around the current page', () => {
    expect(pageList(6, 12)).toEqual([1, '…', 5, 6, 7, '…', 12]);
    expect(pageList(1, 12)).toEqual([1, 2, '…', 12]);
    expect(pageList(12, 12)).toEqual([1, '…', 11, 12]);
  });
});
