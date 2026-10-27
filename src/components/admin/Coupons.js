import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, FormControl, IconButton, InputLabel, MenuItem,
  Select, Snackbar, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { Api } from "@/lib/api";

// P10-5 — the owner's rules: percentage off only, one use per customer (the
// API enforces it by phone, email and account), and a coupon may take money
// off the delivery fee. Coupons are handed out by the shop; the storefront
// never advertises one, and never claims "free delivery".

const APPLIES = [
  { value: "items", label: "The items" },
  { value: "delivery", label: "The delivery fee" },
  { value: "both", label: "Items and delivery" },
];
const EMPTY = { code: "", percentOff: "10", appliesTo: "items", note: "" };

export default function Coupons() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const notify = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const load = useCallback(async () => {
    try {
      const res = await Api.get("/admin/coupons");
      setList(res.data?.coupons || []);
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await Api.post("/admin/coupons", { ...form, percentOff: Number(form.percentOff) });
      notify(`${res.data.coupon.code} created — ${res.data.coupon.description}.`);
      setForm(EMPTY);
      load();
    } catch (err) {
      notify(err?.response?.data?.message || "Couldn't create the coupon", "error");
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (c) => {
    try {
      await Api.patch(`/admin/coupons/${c._id}`, { active: !c.active });
      notify(`${c.code} ${c.active ? "switched off" : "switched on"}.`);
      load();
    } catch (err) {
      notify(err?.response?.data?.message || "Couldn't update the coupon", "error");
    }
  };

  const remove = async (c) => {
    if (typeof window !== "undefined" && !window.confirm(`Delete ${c.code}? This can't be undone.`)) return;
    try {
      await Api.delete(`/admin/coupons/${c._id}`);
      notify(`${c.code} deleted.`);
      load();
    } catch (err) {
      notify(err?.response?.data?.message || "Couldn't delete the coupon", "error");
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>Coupons</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Percentage off. Each customer can use a coupon once (checked by phone, email and account).
        A cancelled order gives its coupon back.
      </Typography>

      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>New coupon</Typography>
          <Box component="form" onSubmit={create}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Code" size="small" required value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                inputProps={{ maxLength: 20 }} helperText="3–20 letters, numbers or dashes, e.g. KARIBU10"
              />
              <TextField
                label="% off" size="small" type="number" required value={form.percentOff}
                onChange={(e) => setForm((f) => ({ ...f, percentOff: e.target.value }))}
                inputProps={{ min: 1, max: 100, step: 1 }} sx={{ width: { md: 110 } }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="applies-label">Takes money off</InputLabel>
                <Select labelId="applies-label" label="Takes money off" value={form.appliesTo}
                  onChange={(e) => setForm((f) => ({ ...f, appliesTo: e.target.value }))}>
                  {APPLIES.map((a) => <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Note (staff only)" size="small" value={form.note} fullWidth
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} inputProps={{ maxLength: 200 }}
              />
              <Button type="submit" variant="contained" disabled={busy || form.code.trim().length < 3} sx={{ whiteSpace: "nowrap" }}>
                Create
              </Button>
            </Stack>
            {form.appliesTo !== "items" && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Pickup orders have no delivery fee, so a delivery-only coupon is refused for pickup. On Nairobi/Machakos
                orders the delivery part applies when you set the fee.
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 600 } }}>
                    <TableCell>Code</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Used on</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>On</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">No coupons yet.</TableCell></TableRow>
                  ) : list.map((c) => (
                    <TableRow key={c._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} sx={{ letterSpacing: 1 }}>{c.code}</Typography>
                        {c.note && <Typography variant="caption" color="text.secondary">{c.note}</Typography>}
                      </TableCell>
                      <TableCell>{c.description}</TableCell>
                      <TableCell>{c.timesUsed} order{c.timesUsed !== 1 ? "s" : ""}</TableCell>
                      <TableCell>{format(new Date(c.createdAt), "dd MMM yyyy")}</TableCell>
                      <TableCell>
                        {/* MUI 7 names the inner input through slotProps (inputProps is ignored). */}
                        <Switch checked={c.active} onChange={() => toggle(c)} slotProps={{ input: { "aria-label": `${c.code} is ${c.active ? "on" : "off"}` } }} />
                        {!c.active && <Chip size="small" label="Off" sx={{ bgcolor: "#f3f4f6", color: "#374151" }} />}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={c.timesUsed ? "Used coupons can only be switched off" : "Delete"}>
                          <span>
                            <IconButton aria-label={`Delete ${c.code}`} disabled={c.timesUsed > 0} onClick={() => remove(c)} sx={{ color: "#991b1b" }}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
