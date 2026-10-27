import { MPESA_TILL, MPESA_TILL_NAME, formatKES } from "@/constants/business";

/**
 * How to pay the shop's M-Pesa Buy Goods Till (P10-3, owner-confirmed Till).
 * The business name line only appears once the owner has confirmed the exact
 * name M-Pesa shows — customers use it to spot a fake till.
 */
export default function MpesaSteps({ amount }) {
  return (
    <ol className="list-decimal space-y-1 pl-5 text-[0.9rem] text-gray-800">
      <li>On your phone, open <strong>M-PESA</strong> and choose <strong>Lipa na M-PESA</strong>, then <strong>Buy Goods and Services</strong>.</li>
      <li>Enter Till number <strong className="tracking-wider">{MPESA_TILL}</strong>.</li>
      <li>Enter the amount{typeof amount === "number" ? <>: <strong>{formatKES(amount)}</strong></> : null}.</li>
      {MPESA_TILL_NAME ? (
        <li>Check the name shown is <strong>{MPESA_TILL_NAME}</strong>, then enter your M-PESA PIN.</li>
      ) : (
        <li>Enter your M-PESA PIN and confirm.</li>
      )}
      <li>You&apos;ll get an SMS from M-PESA. Type the code at the start of it (e.g. SJ12AB3CDE) below.</li>
    </ol>
  );
}
