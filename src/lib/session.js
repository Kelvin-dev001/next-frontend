// P10-4. The customer session itself is an httpOnly cookie that page
// JavaScript cannot read. This non-secret hint only records "this browser has
// signed in", so a visitor who never signed in makes no account request at all
// — on a metered connection every request costs the customer money.
const HINT = "snaap_signed_in";

export function hasSessionHint() {
  try {
    return window.localStorage.getItem(HINT) === "1";
  } catch {
    return false;
  }
}

export function setSessionHint(on) {
  try {
    if (on) window.localStorage.setItem(HINT, "1");
    else window.localStorage.removeItem(HINT);
  } catch {
    /* storage blocked: the account page still works, it just checks each time */
  }
}
