"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Api } from "@/lib/api";

const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

export default function RequireAdmin({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setIsAdmin(false);
          setChecking(false);
          router.replace("/admin/login");
        }
        return;
      }
      try {
        const { data } = await Api.get("/admin/check");
        if (!cancelled) {
          setIsAdmin(Boolean(data?.isAdmin));
          setChecking(false);
          if (!data?.isAdmin) router.replace("/admin/login");
        }
      } catch {
        if (!cancelled) {
          setIsAdmin(false);
          setChecking(false);
          router.replace("/admin/login");
        }
      }
    }

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) return null;
  return isAdmin ? children : null;
}