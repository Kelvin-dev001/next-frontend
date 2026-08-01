import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaSlidersH, FaTimes } from "react-icons/fa";
import { Api } from "@/lib/api";
import AutoCompleteSearch from "@/components/AutoCompleteSearch";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/ui/Button";

const PRODUCTS_PER_PAGE_OPTIONS = [12, 24, 48, 96, 200, 500, 1000];
const SITE_NAME = "Snaap Connections";
const SITE_URL = "https://www.snaapconnections.co.ke";
const PAGE_TITLE = "Shop Phones in Mombasa & Kenya | Snaap Connections";
const PAGE_DESCRIPTION =
  "Browse smartphones, accessories, and top deals in Mombasa with nationwide delivery across Kenya.";

// P1-11: only surface a facet in the <h1> / index it when the value maps to a
// real brand or category.
const resolveKnownName = (value, list) => {
  const v = String(value ?? "").trim();
  if (!v) return null;
  const match = (list || []).find((item) => String(item?.name ?? "").toLowerCase() === v.toLowerCase());
  return match ? match.name : null;
};

// Windowed page list with ellipses (crawlable links preserved for each shown page).
function buildPageItems(current, total) {
  const raw = [...new Set([1, 2, total - 1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const items = [];
  let prev = 0;
  for (const p of raw) {
    if (p - prev > 1) items.push("…");
    items.push(p);
    prev = p;
  }
  return items;
}

export default function ProductListingPage({
  initialProducts = [],
  initialTotal = 0,
  initialFilters = {},
  serverHeading = "All Products",
  serverIndexable = true,
}) {
  const router = useRouter();
  const skipFirstFetch = useRef(true);

  const brandFromQuery = useMemo(() => (router.query.brand ? String(router.query.brand) : ""), [router.query.brand]);
  const categoryFromQuery = useMemo(() => (router.query.category ? String(router.query.category) : ""), [router.query.category]);
  const sortFromQuery = useMemo(() => (router.query.sort ? String(router.query.sort) : ""), [router.query.sort]);
  const dealTypeFromQuery = useMemo(() => (router.query.dealType ? String(router.query.dealType) : ""), [router.query.dealType]);
  const pageFromQuery = useMemo(() => {
    const p = Number(router.query.page);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [router.query.page]);
  const minPriceFromQuery = useMemo(() => (router.query.minPrice ? Number(router.query.minPrice) : 0), [router.query.minPrice]);
  const maxPriceFromQuery = useMemo(() => (router.query.maxPrice ? Number(router.query.maxPrice) : 500000), [router.query.maxPrice]);

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(initialTotal);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [clientFacetsReady, setClientFacetsReady] = useState(false);

  const [filters, setFilters] = useState({
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 12,
    category: initialFilters.category || "",
    brand: initialFilters.brand || "",
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 500000,
    sort: initialFilters.sort || "random",
    search: initialFilters.search || "",
    dealType: initialFilters.dealType || "",
  });

  // P1-11: resolve facet against known lists; fall back to server values before the client lists load.
  const heading = useMemo(() => {
    if (!clientFacetsReady) return serverHeading;
    return resolveKnownName(filters.category, categories) || resolveKnownName(filters.brand, brands) || "All Products";
  }, [clientFacetsReady, serverHeading, filters.category, filters.brand, categories, brands]);

  const indexable = useMemo(() => {
    if (!clientFacetsReady) return serverIndexable;
    const brandJunk = String(filters.brand || "").trim() && !resolveKnownName(filters.brand, brands);
    const categoryJunk = String(filters.category || "").trim() && !resolveKnownName(filters.category, categories);
    return !brandJunk && !categoryJunk;
  }, [clientFacetsReady, serverIndexable, filters.brand, filters.category, brands, categories]);

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/products`,
    inLanguage: "en-KE",
    about: "Phones and electronics in Mombasa and Kenya",
  };

  useEffect(() => {
    if (!router.isReady) return;
    setFilters((prev) => ({
      ...prev,
      category: categoryFromQuery,
      brand: brandFromQuery,
      sort: sortFromQuery || prev.sort,
      minPrice: Number.isFinite(minPriceFromQuery) ? minPriceFromQuery : 0,
      maxPrice: Number.isFinite(maxPriceFromQuery) ? maxPriceFromQuery : 500000,
      dealType: dealTypeFromQuery,
      page: pageFromQuery,
    }));
  }, [router.isReady, categoryFromQuery, brandFromQuery, sortFromQuery, minPriceFromQuery, maxPriceFromQuery, dealTypeFromQuery, pageFromQuery]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([Api.get("/categories"), Api.get("/brands")]);
        setCategories(categoriesRes.data?.categories || categoriesRes.data || []);
        setBrands(brandsRes.data?.brands || brandsRes.data || []);
      } catch {
        setCategories([]);
        setBrands([]);
      } finally {
        setClientFacetsReady(true);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (skipFirstFetch.current) {
          skipFirstFetch.current = false;
          return;
        }
        setLoading(true);
        setError(null);
        const response = await Api.get("/products", {
          params: {
            page: filters.page, limit: filters.limit, category: filters.category, brand: filters.brand,
            minPrice: filters.minPrice, maxPrice: filters.maxPrice, search: filters.search, sort: filters.sort, dealType: filters.dealType,
          },
        });
        setProducts(response.data?.products || []);
        setTotalProducts(response.data?.total || response.data?.count || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleSortChange = (e) => setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
  const handleProductsPerPageChange = (e) => setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }));
  const handlePageChange = (_e, value) => setFilters((prev) => ({ ...prev, page: value }));

  // Real, crawlable URL for each pagination item (P1-1).
  const buildPageHref = (targetPage) => {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set("page", String(targetPage));
    if (filters.category) params.set("category", filters.category);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.sort && filters.sort !== "random") params.set("sort", filters.sort);
    if (filters.dealType) params.set("dealType", filters.dealType);
    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice && filters.maxPrice !== 500000) params.set("maxPrice", String(filters.maxPrice));
    if (filters.limit && filters.limit !== 12) params.set("limit", String(filters.limit));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };
  const clearFilters = () => {
    setFilters({ page: 1, limit: 12, category: "", brand: "", minPrice: 0, maxPrice: 500000, sort: "random", search: "", dealType: "" });
    router.replace("/products", undefined, { shallow: true });
  };
  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };
  const handleSearchSelect = (productId) => router.push(`/products/${productId}`);

  const totalPages = Math.ceil(totalProducts / filters.limit);
  const pageItems = totalPages > 1 ? buildPageItems(filters.page, totalPages) : [];

  const selectCls = "rounded border border-gray-300 bg-white px-2 py-1 text-[0.75rem] md:text-[0.875rem]";

  if (error) {
    return (
      <div className="px-4 py-8">
        <p className="mb-2 text-red-600">{error}</p>
        <Button variant="solid" fullWidth={false} onClick={() => setError(null)}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="robots" content={indexable ? "index,follow" : "noindex,follow"} />
        <link rel="canonical" href={`${SITE_URL}/products`} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/products`} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }} />
      </Head>

      <div className="mx-auto max-w-screen-2xl px-0 py-1 md:px-6 md:py-3">
        {/* Top bar: title + controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1.5 md:px-0">
          <h1 className="font-semibold text-[1.1rem] md:text-[1.5rem]">
            {heading}
            <span className="ml-1 text-sm font-normal text-gray-500">({totalProducts} products)</span>
          </h1>

          <div className="flex items-center gap-2">
            <select value={filters.limit} onChange={handleProductsPerPageChange} className={selectCls} aria-label="Products per page">
              {PRODUCTS_PER_PAGE_OPTIONS.map((o) => (<option key={o} value={o}>{o} / page</option>))}
            </select>
            <select value={filters.sort} onChange={handleSortChange} className={selectCls} aria-label="Sort">
              <option value="random">Random</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <button onClick={() => setShowFilters(true)} className="grid place-items-center rounded border border-gray-300 p-1.5 md:hidden" aria-label="Open filters">
              <FaSlidersH />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-[260px] flex-shrink-0 md:block">
            <SidebarFilters filters={filters} setFilters={setFilters} categories={categories} brands={brands} handleSearchSelect={handleSearchSelect} clearFilters={clearFilters} />
          </aside>

          {/* Mobile filter overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-[1300] overflow-y-auto bg-white p-4 md:hidden">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-semibold">Filters</p>
                <button onClick={() => setShowFilters(false)} aria-label="Close filters"><FaTimes /></button>
              </div>
              <SidebarFilters filters={filters} setFilters={setFilters} categories={categories} brands={brands} handleSearchSelect={handleSearchSelect} clearFilters={clearFilters} />
              <Button variant="solid" onClick={() => setShowFilters(false)} className="mt-2">Show Results</Button>
            </div>
          )}

          {/* Product grid + pagination */}
          <div className="w-full min-w-0 flex-1">
            <ProductGrid
              items={products}
              loading={loading}
              skeletonCount={filters.limit > 12 ? 12 : filters.limit}
              eagerCount={6}
              size="compact"
              showWhatsApp
              showViewBtn
              onWishlistToggle={toggleWishlist}
              isWishlisted={(p) => wishlist.includes(p._id)}
            />

            {totalPages > 1 && (
              <nav className="mb-2 mt-8 flex flex-wrap justify-center gap-1" aria-label="Pagination">
                {filters.page > 1 && (
                  <Link href={buildPageHref(filters.page - 1)} onClick={(e) => { e.preventDefault(); handlePageChange(e, filters.page - 1); }} className="min-w-9 rounded border border-gray-300 px-3 py-1 text-center text-sm hover:bg-gray-100" aria-label="Previous page">‹</Link>
                )}
                {pageItems.map((item, i) =>
                  item === "…" ? (
                    <span key={`e${i}`} className="px-2 py-1 text-gray-400">…</span>
                  ) : (
                    <Link
                      key={item}
                      href={buildPageHref(item)}
                      onClick={(e) => { e.preventDefault(); handlePageChange(e, item); }}
                      aria-current={item === filters.page ? "page" : undefined}
                      className={`min-w-9 rounded px-3 py-1 text-center text-sm ${item === filters.page ? "bg-[#1e3c72] text-white" : "border border-gray-300 hover:bg-gray-100"}`}
                    >
                      {item}
                    </Link>
                  )
                )}
                {filters.page < totalPages && (
                  <Link href={buildPageHref(filters.page + 1)} onClick={(e) => { e.preventDefault(); handlePageChange(e, filters.page + 1); }} className="min-w-9 rounded border border-gray-300 px-3 py-1 text-center text-sm hover:bg-gray-100" aria-label="Next page">›</Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarFilters({ filters, setFilters, categories, brands, handleSearchSelect, clearFilters }) {
  const setPrice = (key, val) =>
    setFilters((f) => ({ ...f, [key]: Number(val) || (key === "maxPrice" ? 500000 : 0), page: 1 }));
  const inputCls = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#1e3c72]";

  return (
    <>
      <div className="mb-6">
        <p className="mb-1 font-semibold">Search</p>
        <AutoCompleteSearch onSelect={handleSearchSelect} placeholder="Search products..." />
      </div>

      <div className="mb-6">
        <p className="mb-1 font-semibold">Price Range (KES)</p>
        <div className="flex items-center gap-2">
          <input type="number" min={0} placeholder="Min" value={filters.minPrice || ""} onChange={(e) => setPrice("minPrice", e.target.value)} className={inputCls} aria-label="Minimum price" />
          <span className="text-gray-400">–</span>
          <input type="number" min={0} placeholder="Max" value={filters.maxPrice === 500000 ? "" : filters.maxPrice} onChange={(e) => setPrice("maxPrice", e.target.value)} className={inputCls} aria-label="Maximum price" />
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-1 font-semibold">Categories</p>
        <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))} className={inputCls}>
          <option value="">All Categories</option>
          {categories.map((cat) => (<option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>))}
        </select>
      </div>

      <div className="mb-6">
        <p className="mb-1 font-semibold">Brands</p>
        <select value={filters.brand} onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value, page: 1 }))} className={inputCls}>
          <option value="">All Brands</option>
          {brands.map((brand) => (<option key={brand._id || brand.name} value={brand.name}>{brand.name}</option>))}
        </select>
      </div>

      <Button variant="outline" onClick={clearFilters} className="mb-2">Clear All Filters</Button>
      <hr className="my-2 border-gray-200" />
    </>
  );
}

export async function getServerSideProps({ query }) {
  const {
    page = 1, limit = 12, category = "", brand = "",
    minPrice = 0, maxPrice = 500000, sort = "random",
    search = "", dealType = "",
  } = query;

  const initialFilters = {
    page: Number(page), limit: Number(limit), category, brand,
    minPrice: Number(minPrice), maxPrice: Number(maxPrice), sort, search, dealType,
  };

  try {
    const [response, brandsRes, categoriesRes] = await Promise.all([
      Api.get("/products", { params: { page, limit, category, brand, minPrice, maxPrice, sort, search, dealType } }),
      Api.get("/brands").catch(() => ({ data: {} })),
      Api.get("/categories").catch(() => ({ data: {} })),
    ]);

    const brands = brandsRes.data?.brands || brandsRes.data || [];
    const categories = categoriesRes.data?.categories || categoriesRes.data || [];
    const resolvedBrand = resolveKnownName(brand, brands);
    const resolvedCategory = resolveKnownName(category, categories);
    const brandJunk = Boolean(String(brand).trim()) && !resolvedBrand;
    const categoryJunk = Boolean(String(category).trim()) && !resolvedCategory;

    return {
      props: {
        initialProducts: response.data?.products || [],
        initialTotal: response.data?.total || response.data?.count || 0,
        initialFilters,
        serverHeading: resolvedCategory || resolvedBrand || "All Products",
        serverIndexable: !brandJunk && !categoryJunk,
      },
    };
  } catch {
    return {
      props: {
        initialProducts: [],
        initialTotal: 0,
        initialFilters,
        serverHeading: "All Products",
        serverIndexable: !(String(brand).trim() || String(category).trim()),
      },
    };
  }
}
