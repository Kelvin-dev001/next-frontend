import { Api } from "@/lib/api";
import { toCardProducts } from "@/utils/productCard";
import { SAFARICOM_DEVICE_SHELVES } from "@/constants/safaricomServices";

const PER_SHELF = 12;

/**
 * The Safaricom device shop's stock, grouped into shelves.
 *
 * Runs in getStaticProps on /safaricom and /safaricom/devices, so every device
 * is a real <a href> in the served HTML.
 *
 * The `safaricomExclusive === true` re-check is not paranoia about our own API:
 * the two repos deploy separately, and until the backend carrying
 * ?safaricom=true is live, that parameter is silently ignored and the endpoint
 * answers with the whole catalogue. Without this filter the Safaricom shop
 * would present every phone in the shop as a Safaricom device. Filtering here
 * means the worst case is an empty shelf, which the pages handle.
 *
 * Shelves with nothing on them are dropped by the caller-facing return value.
 */
export async function fetchSafaricomShelves() {
  const responses = await Promise.all(
    SAFARICOM_DEVICE_SHELVES.map((shelf) =>
      Api.get("/products", {
        params: { safaricom: "true", safaricomType: shelf.type, limit: PER_SHELF, sort: "newest" },
      })
        .then((res) => res.data?.products || [])
        // One dead shelf must not take the whole page down with it.
        .catch(() => [])
    )
  );

  return SAFARICOM_DEVICE_SHELVES.map((shelf, index) => ({
    type: shelf.type,
    title: shelf.title,
    blurb: shelf.blurb,
    products: toCardProducts(
      responses[index].filter(
        (product) => product?.safaricomExclusive === true && product?.safaricomType === shelf.type
      )
    ),
  })).filter((shelf) => shelf.products.length > 0);
}
