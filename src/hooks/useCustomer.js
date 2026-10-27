import { useEffect, useSyncExternalStore } from "react";
import { Api } from "@/lib/api";
import { hasSessionHint, setSessionHint } from "@/lib/session";
import { mergeWishlistWithAccount } from "@/hooks/useWishlist";

// P10-4 — who is signed in, shared by the header, checkout and the account
// pages. One module-level store, so the "who am I" request is made at most once
// per page load, and never by a visitor who has not signed in on this browser.
const SERVER_STATE = { status: "unknown", user: null }; // unknown | loading | signedIn | signedOut
let state = SERVER_STATE;
let inflight = null;
const listeners = new Set();

const set = (next) => {
  state = next;
  listeners.forEach((listener) => listener());
};

export function loadCustomer() {
  if (inflight) return inflight;
  if (state.status === "signedIn" || state.status === "signedOut") return Promise.resolve(state.user);
  if (!hasSessionHint()) {
    set({ status: "signedOut", user: null });
    return Promise.resolve(null);
  }
  set({ status: "loading", user: null });
  inflight = Api.get("/customer/me")
    .then((res) => {
      set({ status: "signedIn", user: res.data.user });
      return res.data.user;
    })
    .catch((err) => {
      // Expired, signed out elsewhere, reset or blocked: forget the hint.
      if (err?.response?.status === 401) setSessionHint(false);
      set({ status: "signedOut", user: null });
      return null;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

// After sign-in, registration, or "create an account" at checkout.
export function signedInAs(user, { mergeWishlist = true } = {}) {
  setSessionHint(true);
  set({ status: "signedIn", user });
  if (mergeWishlist) mergeWishlistWithAccount();
}

export function updateSignedInUser(user) {
  set({ status: "signedIn", user });
}

export async function signOut() {
  try {
    await Api.post("/customer/logout");
  } catch {
    /* the hint goes regardless; the cookie expires on its own */
  }
  setSessionHint(false);
  set({ status: "signedOut", user: null });
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export default function useCustomer() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  useEffect(() => {
    if (snapshot.status === "unknown") loadCustomer();
  }, [snapshot.status]);
  return snapshot;
}
