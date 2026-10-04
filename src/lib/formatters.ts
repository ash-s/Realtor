/**
 * Deterministic number and date formatting to completely prevent React SSR hydration mismatches
 * between server-side rendering (Node.js) and client browsers with differing regional locales (e.g. en-US vs en-IN).
 */

export function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'number' ? Math.round(val) : Math.round(Number(val));
  if (isNaN(num)) return '0';
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatCurrency(val: number | string | undefined | null): string {
  return `$${formatNumber(val)}`;
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return String(dateStr);
  }
}
