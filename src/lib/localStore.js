/**
 * A tiny JSON value kept in localStorage, readable with React's
 * useSyncExternalStore (P10). Shared by the wishlist and the cart so neither
 * needs a context provider or a dependency — everything here ships on every
 * storefront page, and payload is a business metric.
 *
 * - The server snapshot is always the empty value, so SSR and the first client
 *   render agree; React re-renders with the stored value right after hydration.
 * - Other tabs stay in sync through the `storage` event.
 * - If localStorage is unavailable (some private modes throw), the value lives
 *   in memory for the session instead of silently doing nothing.
 */
export function createLocalStore(key, empty = "[]") {
  let memory = null;
  const listeners = new Set();
  const emit = () => listeners.forEach((listener) => listener());

  const getSnapshot = () => {
    try {
      return window.localStorage.getItem(key) ?? memory ?? empty;
    } catch {
      return memory ?? empty;
    }
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e) => {
        if (e.key === key) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot,
    getServerSnapshot: () => empty,
    write(value) {
      const raw = JSON.stringify(value);
      try {
        window.localStorage.setItem(key, raw);
      } catch {
        memory = raw;
      }
      emit();
    },
  };
}

export function parseJSON(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
