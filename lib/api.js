const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

async function apiGet(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    next: options.next, // for ISR/SSR caching hints
  });
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json();
}

export const Api = {
  getFeaturedProducts: () => apiGet('/products?featured=true'),
  getProducts: (params = '') => apiGet(`/products${params}`),
  getCategories: () => apiGet('/categories'),
  getBrands: () => apiGet('/brands'),
  getRecentReviews: () => apiGet('/reviews/recent'),
};