export function formatDate(date: string) { return new Date(date).toLocaleDateString(); }

/** Returns a Date `days` from today (negative = past). */
export function relativeDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

/** Returns an ISO date string (YYYY-MM-DD) `days` from today. */
export function relativeDateISO(days: number): string {
  return relativeDate(days).toISOString().split('T')[0];
}
