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
import Link from "next/link";
import { ShoppingCart, PendingActions, ReceiptLong, MonetizationOn } from "@mui/icons-material";
import { BarChart, PieChart } from "@mui/x-charts";
import { Api } from "@/lib/api";
import { formatKES } from "@/constants/business";
import ErrorAlert from "@/components/ErrorAlert";
import AdminReviewsTable from "@/components/admin/AdminReviewsTable";

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
    // P10-3: one request to /admin/dashboard. The four calls this replaced asked
    // /orders and /products for stats parameters neither route ever supported.
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await Api.get("/admin/dashboard");
        setStats(res.data?.stats || {});
        setRecentOrders(res.data?.recentOrders || []);
        setSalesData(res.data?.sales || []);
        setProductDistribution(res.data?.productDistribution || []);
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
        <StatCard icon={<PendingActions color="warning" sx={{ fontSize: 32, mr: 2 }} />} title="New orders" value={stats?.pendingOrders ?? 0} subtitle="Pending — waiting to be confirmed" />
        <StatCard icon={<ReceiptLong color="info" sx={{ fontSize: 32, mr: 2 }} />} title="Codes to check" value={stats?.paymentsToCheck ?? 0} subtitle="M-Pesa codes to find on the statement" />
        <StatCard icon={<ShoppingCart color="primary" sx={{ fontSize: 32, mr: 2 }} />} title="Orders" value={stats?.totalOrders ?? 0} subtitle={`${stats?.totalDelivered ?? 0} delivered`} />
        <StatCard icon={<MonetizationOn color="success" sx={{ fontSize: 32, mr: 2 }} />} title="Revenue" value={formatKES(stats?.totalRevenue || 0)} subtitle="Paid, dispatched and delivered" />
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
                Sales Overview (Last 6 Months)
              </Typography>
              <Box sx={{ height: 300 }}>
                <BarChart
                  dataset={salesData}
                  xAxis={[{ dataKey: "month", scaleType: "band", label: "Month" }]}
                  series={[
                    {
                      dataKey: "total",
                      label: "Paid sales",
                      valueFormatter: (v) => formatKES(Number(v || 0)),
                      color: theme.palette.primary.main,
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
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
          <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
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
                          <Link href="/admin/orders">{order.orderNumber || "Legacy order"}</Link>
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
                          {!order.totals
                            ? "—"
                            : order.totals.total == null
                              ? `${formatKES((order.totals.subtotal || 0) - (order.totals.itemsDiscount || 0))} + delivery`
                              : formatKES(order.totals.total)}
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
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            {icon}
            <Typography variant="h6" component="h2">{title}</Typography>
          </Box>
          <Typography variant="h4" component="p" fontWeight={700}>
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

function StatusChip({ status }) {
  // Explicit pairs: MUI's *.light fills with *.dark text measured under 4.5:1.
  const done = ["paid", "dispatched", "delivered"].includes(status);
  const tone = done
    ? { bgcolor: "#dcfce7", color: "#166534" }
    : status === "pending"
      ? { bgcolor: "#fef3c7", color: "#92400e" }
      : status === "cancelled"
        ? { bgcolor: "#fee2e2", color: "#991b1b" }
        : { bgcolor: "#f3f4f6", color: "#374151" };
  return (
    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: 1, ...tone }}>
      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        {status}
      </Typography>
    </Box>
  );
}