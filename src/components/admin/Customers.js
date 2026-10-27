"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import { Search, Clear, LockReset, Block, CheckCircle } from "@mui/icons-material";
import { format } from "date-fns";
import { Api } from "@/lib/api";
import { formatKES } from "@/constants/business";

// P10-4: customer accounts. This page used to call /customers and
// PATCH /customers/:id, neither of which exists (the API lives at
// /admin/customers), so it never loaded.
//
// Password reset is the owner's chosen flow: no email link. The admin resets
// here, reads the temporary password to the customer (phone or WhatsApp), and
// the customer must choose their own at the next sign-in.

const TONE = {
  active: { bgcolor: "#dcfce7", color: "#166534" },
  blocked: { bgcolor: "#fee2e2", color: "#991b1b" },
};
const when = (d) => (d ? format(new Date(d), "dd MMM yyyy") : "—");

export default function Customers() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [customers, setCustomers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [confirm, setConfirm] = useState(null); // { kind: 'reset'|'block'|'unblock', customer }
  const [temporary, setTemporary] = useState(null); // { email, password }
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const load = useCallback(async () => {
    try {
      const res = await Api.get("/admin/customers", { params: { page: page + 1, limit: rowsPerPage, search: search || undefined } });
      setCustomers(res.data?.customers || []);
      setCount(res.data?.count || 0);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const act = async () => {
    const { kind, customer } = confirm;
    setConfirm(null);
    try {
      if (kind === "reset") {
        const res = await Api.post(`/admin/customers/${customer._id}/reset-password`);
        setTemporary({ email: res.data.email, password: res.data.temporaryPassword });
      } else {
        await Api.patch(`/admin/customers/${customer._id}`, { isActive: kind === "unblock" });
        setSnackbar({ open: true, severity: "success", message: kind === "block" ? `${customer.name} is blocked and signed out.` : `${customer.name} can sign in again.` });
      }
      load();
    } catch (err) {
      setSnackbar({ open: true, severity: "error", message: err?.response?.data?.message || "That didn't work. Try again." });
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>Customers</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Customers with an account. Guest orders are in Orders.
      </Typography>

      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ pb: "16px !important" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search name, email or phone"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            inputProps={{ "aria-label": "Search customers" }}
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
              endAdornment: searchInput && (
                <IconButton aria-label="Clear search" size="small" onClick={() => setSearchInput("")}><Clear fontSize="small" /></IconButton>
              ),
            }}
          />
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          {loading && customers.length === 0 ? (
            <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 600 } }}>
                      <TableCell>Customer</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Last sign-in</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.length === 0 ? (
                      <TableRow><TableCell colSpan={7} align="center">No customers found.</TableCell></TableRow>
                    ) : customers.map((c) => (
                      <TableRow key={c._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{c.email}</Typography>
                        </TableCell>
                        <TableCell>{c.phone || "—"}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{c.ordersCount} order{c.ordersCount !== 1 ? "s" : ""}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatKES(c.totalSpent || 0)} paid</Typography>
                        </TableCell>
                        <TableCell>{when(c.createdAt)}</TableCell>
                        <TableCell>{when(c.lastLoginAt)}</TableCell>
                        <TableCell>
                          <Chip size="small" label={c.isActive ? "Active" : "Blocked"} sx={c.isActive ? TONE.active : TONE.blocked} />
                          {c.mustChangePassword && <Chip size="small" label="Temp password" sx={{ ml: 0.5, bgcolor: "#fef3c7", color: "#92400e" }} />}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Reset password">
                            <IconButton aria-label={`Reset password for ${c.name}`} onClick={() => setConfirm({ kind: "reset", customer: c })}>
                              <LockReset fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={c.isActive ? "Block" : "Unblock"}>
                            <IconButton
                              aria-label={`${c.isActive ? "Block" : "Unblock"} ${c.name}`}
                              onClick={() => setConfirm({ kind: c.isActive ? "block" : "unblock", customer: c })}
                              sx={{ color: c.isActive ? "#991b1b" : "#166534" }}
                            >
                              {c.isActive ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                            </IconButton>
                          </Tooltip>
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

      <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)} aria-labelledby="confirm-title">
        {confirm && (
          <>
            <DialogTitle id="confirm-title">
              {confirm.kind === "reset" ? "Reset password?" : confirm.kind === "block" ? "Block this customer?" : "Unblock this customer?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {confirm.kind === "reset"
                  ? `${confirm.customer.name} (${confirm.customer.email}) will be signed out everywhere and given a temporary password, which you give them. They choose their own at the next sign-in.`
                  : confirm.kind === "block"
                    ? `${confirm.customer.name} will be signed out everywhere and won't be able to sign in. Their orders are not affected.`
                    : `${confirm.customer.name} will be able to sign in again.`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirm(null)}>Cancel</Button>
              <Button variant="contained" color={confirm.kind === "block" ? "error" : "primary"} onClick={act}>
                {confirm.kind === "reset" ? "Reset password" : confirm.kind === "block" ? "Block" : "Unblock"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={Boolean(temporary)} onClose={() => setTemporary(null)} aria-labelledby="temp-title">
        {temporary && (
          <>
            <DialogTitle id="temp-title">Temporary password</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Give this to the customer ({temporary.email}). It is shown <strong>only once</strong> — we keep just a scrambled copy.
                They sign in with it and must then choose their own password.
              </DialogContentText>
              <Typography sx={{ fontFamily: "monospace", fontSize: "1.6rem", letterSpacing: 2, textAlign: "center", p: 1.5, bgcolor: "grey.100", borderRadius: 1 }}>
                {temporary.password}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { navigator.clipboard?.writeText(temporary.password); }}>Copy</Button>
              <Button variant="contained" onClick={() => setTemporary(null)}>Done</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
