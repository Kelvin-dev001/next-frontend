import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "");

if (!apiBaseUrl) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not set. API calls will fail in production. Set it in your Vercel/ENV config."
  );
}

const ApiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12000,
});

// Attach token (client-side only)
ApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwtToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to accept either params object or query string like "?limit=120"
const toParams = (input) => {
  if (!input) return {};
  if (typeof input === "string") {
    const qs = input.startsWith("?") ? input.slice(1) : input;
    return Object.fromEntries(new URLSearchParams(qs));
  }
  return input;
};

export const Api = {
  // Core products
  getProducts: (params) => ApiClient.get("/products", { params: toParams(params) }),
  getProduct: (id) => ApiClient.get(`/products/${id}`),
  getFeaturedProducts: () => ApiClient.get("/products/featured"),

  // Taxonomy
  getCategories: (params) => ApiClient.get("/categories", { params }),
  getBrands: (params) => ApiClient.get("/brands", { params }),

  // Reviews
  getRecentReviews: (params) => ApiClient.get("/reviews/recent", { params }),
  getProductReviews: (productId) => ApiClient.get(`/products/${productId}/reviews`),
  submitProductReview: (productId, payload) =>
    ApiClient.post(`/products/${productId}/reviews`, payload),

  // Bot
  sendBotMessage: (message) => ApiClient.post("/bot/message", { message }),

  // Expose raw client if you need custom calls
  client: ApiClient,
};

export default Api;