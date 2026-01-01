"use client";
import { useEffect, useState } from "react";
import { Api } from "@/lib/api";

export default function useProducts(search = "") {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.get("/products", { params: search ? { search } : {} })
      .then((res) => setProducts(res.data?.products || res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search]);

  return { products, loading };
}