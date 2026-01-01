"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ShoppingCart, People, LocalShipping, MonetizationOn } from "@mui/icons-material";
import { BarChart, PieChart } from "@mui/x-charts";
import { Api } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";
import AdminReviewsTable from "./AdminReviewsTable";

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [productDistribution, setProductDistribution] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, salesRes, productsRes] = await Promise.all([
          Api.get("/orders", { params: { status: "completed", limit: 1, statsOnly: true } }),
          Api.get("/orders", { params: { limit: 5 } }),
          Api.get("/orders", { params: { statsBy: "month", limit: 6 } }),
          Api.get("/products", { params: { limit: 100, stats: "category" } }),
        ]);

        setStats(statsRes?.data?.stats || {});
        setRecentOrders(Array.isArray(ordersRes?.data?.orders) ? ordersRes.data.orders : ordersRes.data || []);
        setSalesData(Array.isArray(salesRes?.data?.stats) ? salesRes.data.stats : []);
        setProductDistribution(Array.isArray(productsRes?.data?.stats) ? productsRes.data.stats : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <ErrorAlert error={error} onClose={() => setError(null)} />;

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard icon={<ShoppingCart color="primary" sx={{ fontSize: 32, mr: 2 }} />} title="Orders" value={stats?.totalOrders ?? 0} subtitle="Total orders placed" />
        <StatCard icon={<People color="secondary" sx={{ fontSize: 32, mr: 2 }} />} title="Customers" value={stats?.totalCustomers ?? 0} subtitle="Registered customers" />
        <StatCard icon={<LocalShipping color="success" sx={{ fontSize: 32, mr: 2 }} />} title="Deliveries" value={stats?.totalDelivered ?? 0} subtitle="Orders delivered" />
        <StatCard icon={<MonetizationOn color="warning" sx={{ fontSize: 32, mr: 2 }} />} title="Revenue" value={`KES ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : "0"}`} subtitle="Total revenue" />
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Sales Overview (Last 6 Months)
              </Typography>
              <Box sx={{ height: 300 }}>
                <BarChart
                  dataset={salesData}
                  xAxis={[{ dataKey: "month", scaleType: "band", label: "Month" }]}
                  series={[
                    {
                      dataKey: "total",
                      label: "Total Sales (KES)",
                      valueFormatter: (v) => `KES ${Number(v || 0).toLocaleString()}`,
                      color: theme.palette.primary.main,
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Product Categories
              </Typography>
              <Box sx={{ height: 300 }}>
                {productDistribution.length > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: productDistribution.map((item) => ({
                          id: item._id,
                          value: item.count,
                          label: item._id,
                        })),
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                      },
                    ]}
                  />
                ) : (
                  <Typography>No product distribution data</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 2, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Orders
          </Typography>
          {recentOrders.length > 0 ? (
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: theme.palette.grey[100], textAlign: "left" }}>
                    <th style={{ padding: "12px 16px" }}>Order ID</th>
                    <th style={{ padding: "12px 16px" }}>Customer</th>
                    <th style={{ padding: "12px 16px" }}>Date</th>
                    <th style={{ padding: "12px 16px" }}>Amount</th>
                    <th style={{ padding: "12px 16px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
                      <td style={{ padding: "12px 16px" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          #{order.orderNumber}
                        </Typography>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Typography variant="body2">{order.customer?.name || "Guest"}</Typography>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Typography variant="body2">{new Date(order.createdAt).toLocaleDateString()}</Typography>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          KES {Number(order.totalAmount || 0).toLocaleString()}
                        </Typography>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <StatusChip status={order.status} theme={theme} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
              No recent orders found
            </Typography>
          )}
        </CardContent>
      </Card>

      <AdminReviewsTable />
    </Box>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function StatusChip({ status, theme }) {
  const bg =
    status === "completed"
      ? "success.light"
      : status === "pending"
      ? "warning.light"
      : status === "cancelled"
      ? "error.light"
      : "grey.100";
  const color =
    status === "completed"
      ? "success.dark"
      : status === "pending"
      ? "warning.dark"
      : status === "cancelled"
      ? "error.dark"
      : "grey.800";
  return (
    <Box
      sx={{
        display: "inline-block",
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        bgcolor: bg,
        color,
      }}
    >
      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        {status}
      </Typography>
    </Box>
  );
}