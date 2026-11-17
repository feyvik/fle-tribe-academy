import { describe, expect, it } from 'vitest';
import { allDays, bonusWeekIds, certificateDate, formatDateTime, isBonus, lessonKey, mainDays, weekOrder, youtubeId } from './course';

describe('course structure', () => {
  it('has a 20-week main course (120 days) followed by the optional bonus courses', () => {
    expect(mainDays).toHaveLength(120);
    expect(weekOrder.slice(0, 20).every((w) => !isBonus(w))).toBe(true);
    expect(bonusWeekIds).toEqual(['ts', 'tw', 'ship', 'ai']);
    expect(allDays).toHaveLength(144);
  });

  it('builds lesson keys the database uses', () => {
    expect(lessonKey('w3', 'fri')).toBe('w3-fri');
  });
});

describe('dates', () => {
  it('formats certificate dates like the printed certificates', () => {
    expect(certificateDate('2025-07-30')).toBe('30th July 2025');
    expect(certificateDate('2026-11-01')).toBe('1st November 2026');
    expect(certificateDate('2026-11-02')).toBe('2nd November 2026');
    expect(certificateDate('2026-11-11')).toBe('11th November 2026');
    expect(certificateDate('2026-11-23')).toBe('23rd November 2026');
  });

  it('shows N/A for a missing date', () => {
    expect(formatDateTime(null)).toBe('N/A');
  });
});

describe('youtubeId', () => {
  it('accepts every common YouTube link and a bare id', () => {
    for (const link of ['https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ']) {
      expect(youtubeId(link)).toBe('dQw4w9WgXcQ');
    }
  });

  it('rejects anything else', () => {
    expect(youtubeId('https://example.com/video')).toBeNull();
    expect(youtubeId('javascript:alert(1)')).toBeNull();
  });
});
