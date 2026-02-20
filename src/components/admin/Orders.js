"use client";
import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  Grid, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, useTheme, useMediaQuery, CircularProgress, Tooltip, TablePagination, Select, MenuItem,
  InputLabel, FormControl
} from "@mui/material";
import { Search, Clear, Visibility, LocalShipping, CheckCircle, Cancel, AccessTime } from "@mui/icons-material";
import { format } from "date-fns";
import { Api } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";

export default function Orders() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
        };
        const response = await Api.get("/orders", { params });
        let fetchedOrders;
        let count;
        if (Array.isArray(response.data)) {
          fetchedOrders = response.data;
          count = response.data.length;
        } else if (Array.isArray(response.data.orders)) {
          fetchedOrders = response.data.orders;
          count = response.data.count || response.data.orders.length;
        } else {
          fetchedOrders = [];
          count = 0;
        }
        setOrders(fetchedOrders);
        setTotalOrders(count);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
        setOrders([]);
        setTotalOrders(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await Api.patch(`/orders/${orderId}/status`, { status: newStatus });
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      };
      const response = await Api.get("/orders", { params });
      const fetchedOrders = Array.isArray(response.data?.orders)
        ? response.data.orders
        : Array.isArray(response.data)
        ? response.data
        : [];
      const count = response.data?.count || fetchedOrders.length;
      setOrders(fetchedOrders);
      setTotalOrders(count);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(price || 0);

  if (loading && orders.length === 0) {
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
        Orders Management
      </Typography>

      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton
                    onClick={() => {
                      setSearchTerm("");
                      setPage(0);
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100], "& th": { fontWeight: 600 } }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          #{order.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.customer?.name || "Guest"}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.customer?.phone || order.customer?.email || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{format(new Date(order.createdAt), "dd MMM yyyy")}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(order.createdAt), "hh:mm a")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatPrice(order.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary" onClick={() => { setSelectedOrder(order); setOpenDialog(true); }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Update Status">
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                sx={{ height: "32px" }}
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalOrders}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        {selectedOrder && (
          <>
            <DialogTitle>
              Order #{selectedOrder.orderNumber}
              <Typography variant="body2" color="text.secondary">
                {format(new Date(selectedOrder.createdAt), "PPPPpp")}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Section title="Customer Information">
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      {selectedOrder.customer?.name || "Guest Customer"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {selectedOrder.customer?.phone || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {selectedOrder.customer?.email || "N/A"}
                    </Typography>
                    {selectedOrder.shippingAddress && (
                      <>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Address:</strong> {selectedOrder.shippingAddress.street}
                        </Typography>
                        <Typography variant="body2">
                          <strong>City:</strong> {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                        </Typography>
                      </>
                    )}
                  </Section>

                  <Section title="Order Summary">
                    <Row label="Subtotal:" value={formatPrice(selectedOrder.subtotal)} />
                    <Row label="Shipping:" value={selectedOrder.shippingFee === 0 ? "FREE" : formatPrice(selectedOrder.shippingFee)} />
                    <Divider sx={{ my: 1 }} />
                    <Row label="Total:" value={formatPrice(selectedOrder.totalAmount)} bold />
                    <Row label="Payment Method:" value={selectedOrder.paymentMethod} />
                    <Row label="Delivery Method:" value={selectedOrder.deliveryMethod} />
                  </Section>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Section title="Order Items">
                    {selectedOrder.items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                          pb: 2,
                          borderBottom: index < selectedOrder.items.length - 1 ? "1px solid #eee" : "none",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              overflow: "hidden",
                              mr: 2,
                              bgcolor: "grey.200",
                            }}
                          >
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.product?.name || "Product not available"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity} × {formatPrice(item.price)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </Box>
                    ))}
                  </Section>

                  <Section title="Order Status">
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <StatusIcon status={selectedOrder.status} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, textTransform: "capitalize" }}>
                          {selectedOrder.status}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last updated: {format(new Date(selectedOrder.updatedAt), "PPPPpp")}
                        </Typography>
                      </Box>
                    </Box>
                    <FormControl fullWidth>
                      <InputLabel>Update Status</InputLabel>
                      <Select
                        value={selectedOrder.status}
                        label="Update Status"
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          handleStatusChange(selectedOrder._id, newStatus);
                          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Section>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: "50px" }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Row({ label, value, bold }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: bold ? 600 : 400 }}>
        {value}
      </Typography>
    </Box>
  );
}

function StatusBadge({ status }) {
  const map = {
    delivered: { bg: "success.light", color: "success.dark", icon: <CheckCircle fontSize="small" /> },
    cancelled: { bg: "error.light", color: "error.dark", icon: <Cancel fontSize="small" /> },
    shipped: { bg: "info.light", color: "info.dark", icon: <LocalShipping fontSize="small" /> },
    processing: { bg: "warning.light", color: "warning.dark", icon: <AccessTime fontSize="small" /> },
    pending: { bg: "warning.light", color: "warning.dark", icon: <AccessTime fontSize="small" /> },
  };
  const { bg, color, icon } = map[status] || { bg: "grey.100", color: "grey.800", icon: <AccessTime fontSize="small" /> };
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        bgcolor: bg,
        color,
      }}
    >
      {icon}
      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        {status}
      </Typography>
    </Box>
  );
}

function StatusIcon({ status }) {
  const map = {
    delivered: { bg: "success.light", color: "success.dark", icon: <CheckCircle fontSize="small" /> },
    cancelled: { bg: "error.light", color: "error.dark", icon: <Cancel fontSize="small" /> },
    shipped: { bg: "info.light", color: "info.dark", icon: <LocalShipping fontSize="small" /> },
    processing: { bg: "warning.light", color: "warning.dark", icon: <AccessTime fontSize="small" /> },
    pending: { bg: "warning.light", color: "warning.dark", icon: <AccessTime fontSize="small" /> },
  };
  const { bg, color, icon } = map[status] || { bg: "grey.100", color: "grey.800", icon: <AccessTime fontSize="small" /> };
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
        color,
      }}
    >
      {icon}
    </Box>
  );
}