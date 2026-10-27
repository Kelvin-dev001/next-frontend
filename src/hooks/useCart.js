import { useCallback, useMemo, useSyncExternalStore } from "react";
import { createLocalStore, parseJSON } from "@/lib/localStore";
import { MAX_QTY_PER_PRODUCT } from "@/constants/business";

// P10-3. The cart lives on this device. Each line keeps a display snapshot
// (name, price, image) so the cart can render instantly on a slow connection,
// but nothing here is trusted: the API prices every quote and every order from
// the catalogue, and the cart page refreshes the snapshot from that quote.
const MAX_LINES = 20;
const store = createLocalStore("snaap_cart_v1");

const isProductId = (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);

function parseLines(raw) {
  const value = parseJSON(raw, []);
  if (!Array.isArray(value)) return [];
  return value
    .filter((l) => l && isProductId(l.id) && Number.isInteger(l.qty) && l.qty >= 1)
    .map((l) => ({ ...l, qty: Math.min(l.qty, MAX_QTY_PER_PRODUCT) }))
    .slice(0, MAX_LINES);
}

const current = () => parseLines(store.getSnapshot());

export const snapshotOf = (product) => ({
  id: String(product?._id || product?.id || ""),
  name: product?.name || "",
  price: product?.discountPrice || product?.price || 0,
  image: product?.thumbnail || (Array.isArray(product?.images) ? product.images[0] : "") || "",
});

export default function useCart() {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const lines = useMemo(() => parseLines(raw), [raw]);
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  // Returns { ok, reason } so the button can say why nothing happened.
  const add = useCallback((product, qty = 1) => {
    const snap = snapshotOf(product);
    if (!isProductId(snap.id)) return { ok: false, reason: "invalid" };
    const list = current();
    const existing = list.find((l) => l.id === snap.id);
    if (existing) {
      if (existing.qty >= MAX_QTY_PER_PRODUCT) return { ok: false, reason: "max-qty" };
      existing.qty = Math.min(existing.qty + qty, MAX_QTY_PER_PRODUCT);
      Object.assign(existing, snap, { qty: existing.qty });
      store.write(list);
      return { ok: true };
    }
    if (list.length >= MAX_LINES) return { ok: false, reason: "full" };
    store.write([...list, { ...snap, qty: Math.max(1, Math.min(qty, MAX_QTY_PER_PRODUCT)) }]);
    return { ok: true };
  }, []);

  const setQty = useCallback((id, qty) => {
    const n = Math.max(1, Math.min(Math.floor(Number(qty)) || 1, MAX_QTY_PER_PRODUCT));
    store.write(current().map((l) => (l.id === id ? { ...l, qty: n } : l)));
  }, []);

  const remove = useCallback((ids) => {
    const drop = new Set([].concat(ids).map(String));
    store.write(current().filter((l) => !drop.has(l.id)));
  }, []);

  const clear = useCallback(() => store.write([]), []);

  // Refresh display snapshots from an API quote's lines (current name/price/image).
  const refreshSnapshots = useCallback((quoteLines) => {
    const byId = new Map((quoteLines || []).map((q) => [String(q.product), q]));
    let changed = false;
    const next = current().map((l) => {
      const q = byId.get(l.id);
      if (!q) return l;
      const updated = { ...l, name: q.name, price: q.unitPrice, image: q.image || l.image };
      if (updated.name !== l.name || updated.price !== l.price || updated.image !== l.image) changed = true;
      return updated;
    });
    if (changed) store.write(next);
  }, []);

  return { lines, count, add, setQty, remove, clear, refreshSnapshots };
}
