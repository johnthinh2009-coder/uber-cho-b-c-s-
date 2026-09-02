/**
 * Date & time helpers for the vi-VN locale.
 *
 * Conventions: 24-hour clock ("15:00"), day/month order ("23/8"),
 * Vietnamese weekday and month names ("Chủ nhật, 23 tháng 8").
 * Everything user-facing goes through here so formats stay consistent.
 */
import { t } from '@/i18n';

const WEEKDAYS_LONG = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const pad = (n: number) => String(n).padStart(2, '0');

const toDate = (value: string | Date): Date => (typeof value === 'string' ? new Date(value) : value);

/** Local "YYYY-MM-DD" key for a date. */
export function dateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

/** Builds an ISO timestamp `days` from now at the given local "HH:mm" time. */
export function atDayOffset(days: number, time = '09:00'): string {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(h ?? 9, m ?? 0, 0, 0);
  return date.toISOString();
}

/** ISO timestamp `minutes` from now (negative for the past). */
export function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export function hoursFromNow(hours: number): string {
  return minutesFromNow(hours * 60);
}

/** 24-hour time: "08:05", "15:00". */
export function formatTime(iso: string | Date): string {
  const date = toDate(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** "HH:mm" → "08:00" (normalised, 24-hour). */
export function formatClock(time: string): string {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return `${pad(h)}:${pad(m)}`;
}

/** "Chủ nhật, 23 tháng 8" */
export function formatLongDate(iso: string | Date = new Date()): string {
  const date = toDate(iso);
  return `${WEEKDAYS_LONG[date.getDay()]}, ${date.getDate()} tháng ${date.getMonth() + 1}`;
}

/** "23/8" */
export function formatShortDate(iso: string | Date): string {
  const date = toDate(iso);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

/** "23/08/2026" */
export function formatDateWithYear(iso: string | Date): string {
  const date = toDate(iso);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** "T6" / "CN" */
export function formatWeekdayShort(iso: string | Date): string {
  return WEEKDAYS_SHORT[toDate(iso).getDay()] ?? '';
}

/** "Thứ sáu" */
export function formatWeekdayLong(iso: string | Date): string {
  return WEEKDAYS_LONG[toDate(iso).getDay()] ?? '';
}

export function isToday(iso: string | Date): boolean {
  return dateKey(toDate(iso)) === todayKey();
}

export function isTomorrow(iso: string | Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return dateKey(toDate(iso)) === dateKey(tomorrow);
}

/** "Hôm nay, 15:00" / "Ngày mai, 09:30" / "T6 28/8, 10:00" */
export function formatRelativeDateTime(iso: string | Date): string {
  const date = toDate(iso);
  if (isToday(date)) return `Hôm nay, ${formatTime(date)}`;
  if (isTomorrow(date)) return `Ngày mai, ${formatTime(date)}`;
  return `${formatWeekdayShort(date)} ${formatShortDate(date)}, ${formatTime(date)}`;
}

/** "Vừa xong", "5 phút trước", "2 giờ trước", "Hôm qua", "12/8" */
export function formatTimeAgo(iso: string | Date, now = new Date()): string {
  const date = toDate(iso);
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.round(minutes / 60);
  if (hours < 24 && isToday(date)) return `${hours} giờ trước`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (dateKey(date) === dateKey(yesterday)) return 'Hôm qua';
  return formatShortDate(date);
}

/** Time-of-day greeting: sáng / trưa / chiều / tối. */
export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 5) return t('greeting.night');
  if (hour < 11) return t('greeting.morning');
  if (hour < 13) return t('greeting.noon');
  if (hour < 18) return t('greeting.afternoon');
  return t('greeting.evening');
}

/** Sort key for "HH:mm" strings. */
export function clockToMinutes(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
}

/** "20 phút", "1 giờ", "1 giờ 35 phút" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} giờ ${m} phút` : `${h} giờ`;
}

/** "01:05" */
export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad(m)}:${pad(s)}`;
}
