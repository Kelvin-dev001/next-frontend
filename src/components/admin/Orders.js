"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, Stack,
  Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField,
  Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import { Search, Clear, Visibility, Refresh, WhatsApp, Phone } from "@mui/icons-material";
import { format } from "date-fns";
import { Api } from "@/lib/api";
import { formatKES, deliveryForCounty } from "@/constants/business";

// P10-3: orders are placed on the site and handled here. Payment is M-Pesa Buy
// Goods — a customer's code is a claim until it's found on the Till statement,
// so every code is verified (or rejected) by hand. Verifying the last payment
// due marks the order paid automatically (the API does that).

const STATUSES = ["pending", "confirmed", "paid", "dispatched", "delivered", "cancelled"];
const STATUS_LABEL = {
  pending: "Pending", confirmed: "Confirmed", paid: "Paid", dispatched: "Dispatched", delivered: "Delivered", cancelled: "Cancelled",
};
// Explicit chip colours: MUI's default warning (orange) and info (light blue)
// fills put white text at ~3:1, which fails WCAG AA. These pairs clear 4.5:1.
const TONE = {
  warning: { bgcolor: "#fef3c7", color: "#92400e" },
  info: { bgcolor: "#e0f2fe", color: "#075985" },
  success: { bgcolor: "#dcfce7", color: "#166534" },
  primary: { bgcolor: "#dbeafe", color: "#1e40af" },
  error: { bgcolor: "#fee2e2", color: "#991b1b" },
  default: { bgcolor: "#f3f4f6", color: "#374151" },
};
const StatusChip = ({ tone = "default", label, outlined }) => (
  <Chip size="small" label={label} variant={outlined ? "outlined" : "filled"} sx={outlined ? { color: "#374151" } : TONE[tone]} />
);
const STATUS_COLOR = {
  pending: "warning", confirmed: "info", paid: "success", dispatched: "primary", delivered: "success", cancelled: "default",
};
const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "payment-check", label: "Codes to check" },
  { value: "confirmed", label: "Confirmed" },
  { value: "paid", label: "Paid" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
const PART_LABEL = { full: "Full payment", items: "Items", delivery: "Delivery fee" };
const REFRESH_MS = 60 * 1000;

const when = (d) => (d ? format(new Date(d), "dd MMM yyyy, HH:mm") : "");
const waNumber = (phone) => String(phone || "").replace(/^\+/, "");

// One word for the money side of an order, for the list.
function paymentChip(order) {
  if (!order.orderNumber) return <StatusChip label="Legacy" />;
  const parts = Object.values(order.payment || {});
  if (parts.some((p) => p.state === "submitted")) return <StatusChip tone="warning" label="Code to check" />;
  if (parts.every((p) => p.state === "verified" || p.state === "none")) return <StatusChip tone="success" label="Paid" />;
  if (parts.some((p) => p.state === "awaiting-fee")) {
    const itemsPaid = order.payment?.items?.state === "verified";
    return <StatusChip tone="info" label={itemsPaid ? "Set delivery fee" : "Unpaid · fee TBC"} />;
  }
  return <StatusChip outlined label="Unpaid" />;
}

function totalText(order) {
  const t = order.totals || {};
  if (!order.orderNumber) return "—";
  if (t.total == null) return `${formatKES((t.subtotal || 0) - (t.itemsDiscount || 0))} + delivery`;
  return formatKES(t.total);
}

export default function Orders() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedId, setSelectedId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Stable, so the open order dialog doesn't refetch every time the list refreshes.
  const notify = useCallback((message, severity = "success") => setSnackbar({ open: true, message, severity }), []);

  const load = useCallback(async () => {
    try {
      const res = await Api.get("/orders", {
        params: { page: page + 1, limit: rowsPerPage, search: search || undefined, status: filter === "all" ? undefined : filter },
      });
      setOrders(res.data?.orders || []);
      setCount(res.data?.count || 0);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, filter]);

  useEffect(() => {
    load();
    const timer = setInterval(() => { if (document.visibilityState === "visible") load(); }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  // Search waits until typing pauses, so each keystroke isn't a request.
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>Orders</Typography>
        <Tooltip title="Refresh">
          <IconButton aria-label="Refresh orders" onClick={() => { setLoading(true); load(); }}><Refresh /></IconButton>
        </Tooltip>
      </Stack>

      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ pb: "12px !important" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search order no., name, phone or M-Pesa code"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            inputProps={{ "aria-label": "Search orders" }}
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
              endAdornment: searchInput && (
                <IconButton aria-label="Clear search" size="small" onClick={() => setSearchInput("")}><Clear fontSize="small" /></IconButton>
              ),
            }}
          />
          <Tabs
            value={filter}
            onChange={(_, v) => { setFilter(v); setPage(0); }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mt: 1 }}
            aria-label="Filter orders by status"
          >
            {FILTERS.map((f) => <Tab key={f.value} value={f.value} label={f.label} />)}
          </Tabs>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          {loading && orders.length === 0 ? (
            <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 600 } }}>
                      <TableCell>Order</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Delivery</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Open</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow><TableCell colSpan={7} align="center">No orders found.</TableCell></TableRow>
                    ) : orders.map((o) => (
                      <TableRow key={o._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{o.orderNumber || "Legacy order"}</Typography>
                          <Typography variant="caption" color="text.secondary">{when(o.createdAt)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{o.customer?.name || "—"}</Typography>
                          <Typography variant="caption" color="text.secondary">{o.customer?.phone || o.phone || ""}</Typography>
                        </TableCell>
                        <TableCell>
                          {o.fulfilment?.method === "pickup" ? "Pickup" : o.fulfilment?.county || "—"}
                        </TableCell>
                        <TableCell>{totalText(o)}</TableCell>
                        <TableCell>{paymentChip(o)}</TableCell>
                        <TableCell>
                          <StatusChip tone={STATUS_COLOR[o.status]} label={STATUS_LABEL[o.status] || o.status} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton aria-label={`Open order ${o.orderNumber || o._id}`} color="primary" onClick={() => setSelectedId(o._id)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {selectedId && (
        <OrderDialog
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={load}
          notify={notify}
          fullScreen={isMobile}
        />
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
      {children}
    </Box>
  );
}

function Row({ label, value, bold }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 0.5 }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, textAlign: "right" }}>{value}</Typography>
    </Box>
  );
}

function OrderDialog({ id, onClose, onChanged, notify, fullScreen }) {
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const [fee, setFee] = useState("");
  const [newCode, setNewCode] = useState("");
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Api.get(`/orders/${id}`)
      .then((res) => { if (!cancelled) setOrder(res.data.order); })
      .catch((err) => { if (!cancelled) notify(err?.response?.data?.message || "Failed to load order", "error"); });
    return () => { cancelled = true; };
  }, [id, notify]);

  const patch = async (body, okMessage) => {
    setBusy(true);
    try {
      const res = await Api.patch(`/orders/${id}`, body);
      setOrder(res.data.order);
      notify(okMessage);
      onChanged();
      return true;
    } catch (err) {
      notify(err?.response?.data?.message || "Update failed", "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (!order) {
    return (
      <Dialog open onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
        <DialogContent><Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box></DialogContent>
      </Dialog>
    );
  }

  const legacy = !order.orderNumber;
  const t = order.totals || {};
  const f = order.fulfilment || {};
  const range = deliveryForCounty(f.county);
  const feeEditable = !legacy && f.method === "delivery" && ["tbc", "confirmed"].includes(order.deliveryStatus);
  const unpaidKinds = Object.entries(order.payment || {}).filter(([, p]) => p.state === "due" || p.state === "submitted").map(([k]) => k);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen} aria-labelledby="order-dialog-title">
      <DialogTitle id="order-dialog-title">
        {legacy ? "Legacy order" : `Order ${order.orderNumber}`}
        <Typography variant="body2" color="text.secondary">Placed {when(order.createdAt)}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {legacy ? (
          <Alert severity="info">
            This order is from before online checkout and can&apos;t be edited here. Phone: {order.phone || "—"}.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Section title="Customer">
                <Typography variant="body1" fontWeight={600}>{order.customer?.name}</Typography>
                <Stack direction="row" spacing={1} sx={{ my: 1 }} flexWrap="wrap">
                  <Button size="small" variant="outlined" startIcon={<Phone />} href={`tel:${order.customer?.phone}`}>{order.customer?.phone}</Button>
                  <Button size="small" variant="outlined" color="success" startIcon={<WhatsApp />} href={`https://wa.me/${waNumber(order.customer?.phone)}`} target="_blank" rel="noopener">WhatsApp</Button>
                </Stack>
                {order.customer?.email && <Typography variant="body2">{order.customer.email}</Typography>}
              </Section>

              <Section title={f.method === "pickup" ? "Pickup from the shop" : "Delivery"}>
                {f.method === "pickup" ? (
                  <Typography variant="body2">Customer collects from Digo Rd.</Typography>
                ) : (
                  <>
                    <Typography variant="body2"><strong>{f.county}</strong>{f.town ? ` — ${f.town}` : ""}</Typography>
                    <Typography variant="body2">{f.address}</Typography>
                  </>
                )}
                {f.notes && <Typography variant="body2" sx={{ mt: 1 }}><strong>Notes:</strong> {f.notes}</Typography>}
              </Section>

              <Section title="Status">
                <FormControl fullWidth size="small">
                  <InputLabel id="order-status-label">Status</InputLabel>
                  <Select
                    labelId="order-status-label"
                    label="Status"
                    value={order.status}
                    disabled={busy}
                    onChange={(e) => patch({ status: e.target.value }, `Status set to ${STATUS_LABEL[e.target.value]}`)}
                  >
                    {STATUSES.map((s) => <MenuItem key={s} value={s}>{STATUS_LABEL[s]}</MenuItem>)}
                  </Select>
                </FormControl>
                <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                  {(order.statusHistory || []).slice().reverse().map((h, i) => (
                    <Typography component="li" variant="caption" display="list-item" key={i} color="text.secondary">
                      {when(h.at)} — {STATUS_LABEL[h.status] || h.status}{h.note ? `: ${h.note}` : ""}
                    </Typography>
                  ))}
                </Box>
              </Section>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Section title="Items">
                {(order.items || []).map((item, i) => (
                  <Row key={i} label={`${item.name} × ${item.quantity}`} value={formatKES(item.lineTotal)} />
                ))}
                <Divider sx={{ my: 1 }} />
                <Row label="Subtotal" value={formatKES(t.subtotal)} />
                {t.itemsDiscount > 0 && <Row label={`Coupon ${order.coupon?.code || ""}`} value={`−${formatKES(t.itemsDiscount)}`} />}
                <Row
                  label={f.method === "pickup" ? "Pickup" : "Delivery"}
                  value={f.method === "pickup" ? "No fee" : t.deliveryFee == null ? `To be confirmed (${range?.priceDisplay || ""})` : formatKES(t.deliveryFee)}
                />
                {t.deliveryDiscount > 0 && <Row label="Coupon on delivery" value={`−${formatKES(t.deliveryDiscount)}`} />}
                <Row label="Total" value={totalText(order)} bold />
              </Section>

              {feeEditable && (
                <Section title="Delivery fee">
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      type="number"
                      sx={{ minWidth: 170 }}
                      label={`KSh ${range?.priceKESMin ?? ""}–${range?.priceKESMax ?? ""}`}
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      inputProps={{ min: range?.priceKESMin, max: range?.priceKESMax, step: 50, "aria-label": "Delivery fee in KSh" }}
                    />
                    <Button variant="contained" disabled={busy || !fee} onClick={async () => { if (await patch({ deliveryFee: Number(fee) }, "Delivery fee saved")) setFee(""); }}>
                      {order.deliveryStatus === "confirmed" ? "Change fee" : "Set fee"}
                    </Button>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Call the customer first. They pay this separately with M-Pesa and send the code from Track your order.
                  </Typography>
                </Section>
              )}

              <Section title="M-Pesa payments">
                {(order.payments || []).length === 0 && <Typography variant="body2" color="text.secondary">No codes yet.</Typography>}
                {(order.payments || []).map((p) => (
                  <Box key={p._id} sx={{ p: 1, mb: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} flexWrap="wrap">
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ letterSpacing: 1 }}>{p.mpesaCode}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {PART_LABEL[p.kind]} · {p.submittedBy === "admin" ? "recorded by admin" : "from customer"} · {when(p.submittedAt)}
                        </Typography>
                      </Box>
                      <StatusChip label={p.status} tone={p.status === "verified" ? "success" : p.status === "rejected" ? "error" : "warning"} />
                    </Stack>
                    {p.possibleDuplicate && (
                      <Alert severity="warning" sx={{ mt: 1, py: 0 }}>This code also appears on another order. Check before verifying.</Alert>
                    )}
                    {p.status === "submitted" && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button size="small" variant="contained" color="success" disabled={busy}
                          onClick={() => patch({ payment: { id: p._id, action: "verify" } }, "Payment verified")}>
                          Found on statement
                        </Button>
                        <Button size="small" variant="outlined" color="error" disabled={busy}
                          onClick={() => patch({ payment: { id: p._id, action: "reject" } }, "Code rejected — the customer will be asked to resend")}>
                          Not found
                        </Button>
                      </Stack>
                    )}
                  </Box>
                ))}
                {unpaidKinds.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField
                      size="small"
                      label={`Code received by phone (${PART_LABEL[unpaidKinds[0]]})`}
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      inputProps={{ maxLength: 14 }}
                      fullWidth
                    />
                    <Button variant="outlined" disabled={busy || newCode.trim().length < 8}
                      onClick={async () => { if (await patch({ addPayment: { mpesaCode: newCode, kind: unpaidKinds[0] } }, "Payment recorded as verified")) setNewCode(""); }}>
                      Record
                    </Button>
                  </Stack>
                )}
              </Section>

              <Section title="Notes (staff only)">
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  size="small"
                  value={notes ?? order.adminNotes ?? ""}
                  onChange={(e) => setNotes(e.target.value)}
                  inputProps={{ maxLength: 2000, "aria-label": "Staff notes" }}
                />
                <Button size="small" sx={{ mt: 1 }} disabled={busy || notes == null}
                  onClick={async () => { if (await patch({ adminNotes: notes }, "Notes saved")) setNotes(null); }}>
                  Save notes
                </Button>
              </Section>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
