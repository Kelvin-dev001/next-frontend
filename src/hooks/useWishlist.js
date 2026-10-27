import { useCallback, useMemo, useSyncExternalStore } from "react";
import { createLocalStore, parseJSON } from "@/lib/localStore";
import { hasSessionHint } from "@/lib/session";
import { Api } from "@/lib/api";

// P10-2. Saved on this device, newest first. Holds product ids only — names
// and prices are always fetched fresh, so a saved item can never show a stale
// price. P10-4: when signed in, every change is also saved to the account, and
// signing in merges the device list with the account's.
const MAX_ITEMS = 100;
const store = createLocalStore("snaap_wishlist_v1");

const isProductId = (id) => typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);

function parseIds(raw) {
  const value = parseJSON(raw, []);
  return Array.isArray(value) ? value.filter(isProductId).slice(0, MAX_ITEMS) : [];
}

const current = () => parseIds(store.getSnapshot());

// Coalesced: a burst of heart taps becomes one request.
let pushTimer = null;
function pushToAccount(ids) {
  if (!hasSessionHint()) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    Api.put("/customer/wishlist", { ids }).catch(() => {});
  }, 600);
}

function write(ids) {
  store.write(ids);
  pushToAccount(ids);
}

// After sign-in: the union of this device and the account, device order first.
export async function mergeWishlistWithAccount() {
  try {
    const res = await Api.get("/customer/wishlist");
    const merged = [...new Set([...current(), ...(res.data?.ids || []).filter(isProductId)])].slice(0, MAX_ITEMS);
    store.write(merged);
    await Api.put("/customer/wishlist", { ids: merged });
  } catch {
    /* the device copy still works; it syncs on the next change */
  }
}

export default function useWishlist() {
  const raw = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const ids = useMemo(() => parseIds(raw), [raw]);

  const has = useCallback((id) => ids.includes(String(id)), [ids]);

  const toggle = useCallback((id) => {
    const key = String(id);
    if (!isProductId(key)) return;
    const list = current();
    write(list.includes(key) ? list.filter((x) => x !== key) : [key, ...list].slice(0, MAX_ITEMS));
  }, []);

  const remove = useCallback((idsToRemove) => {
    const drop = new Set([].concat(idsToRemove).map(String));
    write(current().filter((x) => !drop.has(x)));
  }, []);

  return { ids, count: ids.length, has, toggle, remove };
}
