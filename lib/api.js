const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

async function apiGet(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    next: options.next,
  });
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json();
}

export const Api = {
  getFeaturedProducts: (params = '') => apiGet(`/products?featured=true${params}`),
  getProducts: (params = '') => apiGet(`/products${params}`),
  getProduct: (id) => apiGet(`/products/${id}`),
  getCategories: () => apiGet('/categories'),
  getBrands: () => apiGet('/brands'),
  getRecentReviews: () => apiGet('/reviews/recent'),
  getProductReviews: (productId) => apiGet(`/products/${productId}/reviews`),
  submitProductReview: (productId, data) => apiPost(`/products/${productId}/reviews`, data),
};