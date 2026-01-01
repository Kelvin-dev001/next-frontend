"use client";
import { useEffect, useState } from "react";
import { Api } from "@/lib/api";

export default function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.get("/brands")
      .then((res) => setBrands(res.data?.brands || res.data || []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading };
}