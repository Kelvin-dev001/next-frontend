import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";
import { Api } from "@/lib/api";

export default function AutoCompleteSearch({ onSelect, placeholder = "Search products, brands, categories..." }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Api.get("/products", { params: { limit: 200 } })
      .then((res) => setProducts(res.data?.products || res.data || []))
      .catch(() => setProducts([]));
  }, []);

  const results = useMemo(() => {
    if (search.trim().length < 2) return [];
    const term = search.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      )
      .slice(0, 12);
  }, [products, search]);

  const handleSelect = (productId) => {
    setSearch("");
    setOpen(false);
    onSelect?.(productId);
    if (!onSelect) router.push(`/products/${productId}`);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-full bg-[#f4f6fa] px-4 py-2 shadow-[0_1px_8px_#6dd5ed22]">
        <FaSearch className="flex-shrink-0 text-[#1e3c72]" />
        <input
          type="text"
          aria-label="search"
          placeholder={placeholder}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="w-full flex-1 bg-transparent text-[1.07rem] outline-none"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute left-0 top-full z-[1300] mt-1 max-h-80 w-full min-w-[280px] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-black/5">
          <ul>
            {results.map((p) => (
              <li key={p._id || p.id}>
                <button
                  type="button"
                  onMouseDown={() => handleSelect(p._id || p.id)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  <span className="block text-sm font-medium text-gray-900">{p.name}</span>
                  <span className="block text-xs text-gray-500">{p.brand} | {p.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
