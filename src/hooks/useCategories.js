"use client";
import { useEffect, useState } from "react";
import { Api } from "@/lib/api";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.get("/categories")
      .then((res) => setCategories(res.data?.categories || res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}