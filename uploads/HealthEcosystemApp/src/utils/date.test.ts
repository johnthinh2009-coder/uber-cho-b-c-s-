import { clockToMinutes, formatClock, formatDateWithYear, formatDuration, formatLongDate, formatSeconds, formatShortDate, greetingForHour } from './date';

describe('Vietnamese date helpers', () => {
  it('greets according to the hour', () => {
    expect(greetingForHour(7)).toBe('Chào buổi sáng');
    expect(greetingForHour(12)).toBe('Chào buổi trưa');
    expect(greetingForHour(15)).toBe('Chào buổi chiều');
    expect(greetingForHour(19)).toBe('Chào buổi tối');
    expect(greetingForHour(2)).toBe('Chào bạn');
  });

  it('uses the 24-hour clock', () => {
    expect(clockToMinutes('08:30')).toBe(510);
    expect(formatClock('8:00')).toBe('08:00');
    expect(formatClock('20:15')).toBe('20:15');
    expect(formatClock('00:05')).toBe('00:05');
  });

  it('formats dates day-first with Vietnamese weekday and month names', () => {
    const sunday = new Date(2026, 7, 23, 9, 0, 0);
    expect(formatLongDate(sunday)).toBe('Chủ nhật, 23 tháng 8');
    expect(formatShortDate(sunday)).toBe('23/8');
    expect(formatDateWithYear(sunday)).toBe('23/08/2026');
  });

  it('formats durations', () => {
    expect(formatDuration(20)).toBe('20 phút');
    expect(formatDuration(60)).toBe('1 giờ');
    expect(formatDuration(95)).toBe('1 giờ 35 phút');
    expect(formatSeconds(65)).toBe('01:05');
  });
});
