import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "");

if (!apiBaseUrl) {
  console.warn("NEXT_PUBLIC_API_URL is not set. API calls will fail in production.");
}

const ApiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12000,
});

export const setToken = (token) => {
  if (!token) return;
  if (typeof window !== "undefined") localStorage.setItem("jwtToken", token);
  ApiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("jwtToken");
  delete ApiClient.defaults.headers.common.Authorization;
};

ApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwtToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const toParams = (input) => {
  if (!input) return {};
  if (typeof input === "string") {
    const qs = input.startsWith("?") ? input.slice(1) : input;
    return Object.fromEntries(new URLSearchParams(qs));
  }
  return input;
};

export const Api = {
  getProducts: (params) => ApiClient.get("/products", { params: toParams(params) }),
  getProduct: (id) => ApiClient.get(`/products/${id}`),
  getFeaturedProducts: () => ApiClient.get("/products/featured"),
  getCategories: (params) => ApiClient.get("/categories", { params }),
  getBrands: (params) => ApiClient.get("/brands", { params }),
  getRecentReviews: (params) => ApiClient.get("/reviews/recent", { params }),
  getProductReviews: (productId) => ApiClient.get(`/products/${productId}/reviews`),
  submitProductReview: (productId, payload) => ApiClient.post(`/products/${productId}/reviews`, payload),
  client: ApiClient,
};

export default Api;