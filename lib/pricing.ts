export const MIN_VIDEOS = 1;
export const MAX_VIDEOS = 100;

export function getUnitPrice(quantity: number) {
  if (quantity >= 50) return 0.95;
  if (quantity >= 10) return 1.3;
  return 1.6;
}

export function clampQuantity(quantity: number) {
  return Math.min(MAX_VIDEOS, Math.max(MIN_VIDEOS, Math.round(quantity)));
}

export function getQuote(quantity: number) {
  const qty = clampQuantity(quantity);
  const unit = getUnitPrice(qty);
  const total = Math.round(qty * unit * 100) / 100;
  const base = qty * 1.6;
  const savings = Math.round((base - total) * 100) / 100;
  const percent = base > 0 ? Math.round((savings / base) * 100) : 0;

  return { quantity: qty, unit, total, savings, percent };
}

export function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
