"use client";
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { Api, setToken } from "@/lib/api"; // ensure setToken is exported from your api helper

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await Api.post("/admin/login", { password });
      if (response.data?.token) setToken(response.data.token);
      router.replace("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f6fa">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 360, width: "100%" }}>
        <Typography variant="h5" fontWeight={600} mb={2} align="center">
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 2 }} autoFocus />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}