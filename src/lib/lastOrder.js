// The order just placed, kept for this browser tab only (sessionStorage), so
// the thank-you page can show it and accept an M-Pesa code without asking the
// customer to type their order number and phone again. Gone when the tab closes.
const KEY = "snaap_last_order";

export function saveLastOrder(value) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage blocked: the thank-you page falls back to order tracking */
  }
}

export function readLastOrder(orderNumber) {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(KEY));
    return value?.order?.orderNumber === orderNumber ? value : null;
  } catch {
    return null;
  }
}
