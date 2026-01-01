"use client";
import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : undefined);

if (!apiBaseUrl) {
  console.warn("NEXT_PUBLIC_API_URL is not set. API calls will fail in production.");
}

export const Api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

// Attach token (if you add auth later)
Api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});