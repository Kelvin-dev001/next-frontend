import { useCallback, useMemo, useSyncExternalStore } from "react";
import { createLocalStore, parseJSON } from "@/lib/localStore";

// P10-2. Saved on this device, newest first. Holds product ids only — names
// and prices are always fetched fresh, so a saved item can never show a stale
// price.
const MAX_ITEMS = 100;
const store = createLocalStore("snaap_wishlist_v1");

const isProductId = (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);

function parseIds(raw) {
  const value = parseJSON(raw, []);
  return Array.isArray(value) ? value.filter(isProductId).slice(0, MAX_ITEMS) : [];
}

const current = () => parseIds(store.getSnapshot());

export default function useWishlist() {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const ids = useMemo(() => parseIds(raw), [raw]);

  const has = useCallback((id) => ids.includes(String(id)), [ids]);

  const toggle = useCallback((id) => {
    const key = String(id);
    if (!isProductId(key)) return;
    const list = current();
    store.write(list.includes(key) ? list.filter((x) => x !== key) : [key, ...list].slice(0, MAX_ITEMS));
  }, []);

  const remove = useCallback((idsToRemove) => {
    const drop = new Set([].concat(idsToRemove).map(String));
    store.write(current().filter((x) => !drop.has(x)));
  }, []);

  return { ids, count: ids.length, has, toggle, remove };
}
