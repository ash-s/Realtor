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

/**
 * Deterministic Indian Numbering system (e.g. 12,34,567)
 * Eliminates server/client hydration mismatch
 */
export function formatIndianNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'number' ? Math.round(val) : Math.round(Number(val));
  if (isNaN(num)) return '0';

  const str = Math.abs(num).toString();
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return num < 0 ? `-${result}` : result;
}

export function formatCurrency(val: number | string | undefined | null): string {
  return `₹${formatIndianNumber(val)}`;
}

/**
 * Compact Indian Rupee for map pins and micro badges (e.g. ₹48 L, ₹4.85 Cr)
 */
export function formatCompactINR(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '₹0';
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num)) return '₹0';

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${cr} Cr`;
  }
  if (num >= 100000) {
    const lk = (num / 100000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${lk} L`;
  }
  return `₹${formatIndianNumber(num)}`;
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
