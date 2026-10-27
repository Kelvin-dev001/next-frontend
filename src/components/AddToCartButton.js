import React, { useEffect, useState } from "react";
import { FaCartPlus, FaCheck } from "react-icons/fa";
import Button from "@/components/ui/Button";
import useCart from "@/hooks/useCart";
import { MAX_QTY_PER_PRODUCT } from "@/constants/business";

const REASONS = {
  "max-qty": `You can order up to ${MAX_QTY_PER_PRODUCT} of this product.`,
  full: "Your cart is full. Check out, or remove something first.",
  invalid: "This product can't be added right now.",
};

/**
 * P10-3: replaces "Buy on WhatsApp". Orders are placed on the site now.
 * The button confirms in place ("Added") and the header cart count goes up;
 * screen readers hear the same through the status line beside it.
 */
export default function AddToCartButton({ product, quantity = 1, className = "", stopPropagation = false }) {
  const cart = useCart();
  const [state, setState] = useState({ added: false, error: "" });

  useEffect(() => {
    if (!state.added && !state.error) return undefined;
    const t = setTimeout(() => setState({ added: false, error: "" }), state.error ? 4000 : 2500);
    return () => clearTimeout(t);
  }, [state]);

  if (product?.inStock === false) {
    return (
      <Button variant="cart" disabled className={`cursor-not-allowed opacity-60 ${className}`}>
        Out of stock
      </Button>
    );
  }

  const onClick = (e) => {
    if (stopPropagation) e.stopPropagation();
    const result = cart.add(product, quantity);
    setState(result.ok ? { added: true, error: "" } : { added: false, error: REASONS[result.reason] || REASONS.invalid });
  };

  const name = product?.name || "Product";
  return (
    <>
      <Button variant="cart" className={className} onClick={onClick} aria-label={`Add ${name} to cart`}>
        {state.added ? <FaCheck aria-hidden="true" /> : <FaCartPlus aria-hidden="true" />}
        {state.added ? "Added" : "Add to cart"}
      </Button>
      <span role="status" className="sr-only">
        {state.added ? `${name} added to your cart.` : state.error}
      </span>
      {state.error && <span className="mt-1 block text-center text-[0.7rem] text-red-700">{state.error}</span>}
    </>
  );
}
