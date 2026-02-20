"use client";
import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Api, removeToken } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await Api.post("/auth/logout");
    } catch (err) {
      /* ignore */
    }
    removeToken();
    if (typeof window !== "undefined") localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };
  return (
    <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ borderRadius: 2, ml: 2 }}>
      Logout
    </Button>
  );
}