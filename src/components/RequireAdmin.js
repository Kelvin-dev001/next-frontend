"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Api } from "@/lib/api";

// P6-D: admin gating no longer reads a token from localStorage (there isn't one).
// The httpOnly cookie is sent automatically (withCredentials); /auth/check verifies
// it server-side.
export default function RequireAdmin({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await Api.get("/auth/check");
        if (cancelled) return;
        const ok = Boolean(data?.isAdmin);
        setIsAdmin(ok);
        setChecking(false);
        if (!ok) router.replace("/admin/login");
      } catch {
        if (cancelled) return;
        setIsAdmin(false);
        setChecking(false);
        router.replace("/admin/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) return null;
  return isAdmin ? children : null;
}
