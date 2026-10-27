"use client";
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, IconButton, Tooltip, CircularProgress, Snackbar, Alert, TablePagination,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Api } from "@/lib/api";

const PAGE_SIZE = 10;

// P10-1: these were /reviews, POST /reviews/:id/approve and DELETE /reviews/:id —
// none of which exist, so moderation 404'd. The API's routes are below.
export default function AdminReviewsTable() {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [page, setPage] = useState(0);
  // Pending first: that is the queue that needs a decision.
  const [status, setStatus] = useState("pending");

  const fetchReviews = async (pageNum = page) => {
    setLoading(true);
    try {
      const res = await Api.get("/admin/reviews", { params: { status, limit: PAGE_SIZE, page: pageNum + 1 } });
      setReviews(res.data?.reviews || []);
      setTotalReviews(res.data?.total || 0);
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Failed to fetch reviews", severity: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const handleApprove = async (reviewId) => {
    setActionLoading(reviewId);
    try {
      await Api.patch(`/admin/reviews/${reviewId}/approve`);
      setSnackbar({ open: true, message: "Review approved — it is now public.", severity: "success" });
      fetchReviews(page);
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Failed to approve review", severity: "error" });
    }
    setActionLoading(null);
  };

  const handleDelete = async (reviewId) => {
    const ok = typeof window === "undefined" ? true : window.confirm("Delete this review permanently?");
    if (!ok) return;
    setActionLoading(reviewId);
    try {
      await Api.delete(`/admin/reviews/${reviewId}`);
      setSnackbar({ open: true, message: "Review deleted.", severity: "success" });
      if (reviews.length === 1 && page > 0) setPage(page - 1);
      else fetchReviews(page);
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Failed to delete review", severity: "error" });
    }
    setActionLoading(null);
  };

  return (
    <Card sx={{ borderRadius: 2, mt: 4 }}>
      <CardContent>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Customer Reviews (Moderation)
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={status}
            onChange={(_, v) => { if (v) { setStatus(v); setPage(0); } }}
            aria-label="Filter reviews"
          >
            <ToggleButton value="pending">Pending</ToggleButton>
            <ToggleButton value="approved">Approved</ToggleButton>
            <ToggleButton value="all">All</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography>{status === "pending" ? "No reviews waiting for approval." : "No reviews found."}</Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone (private)</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>{review.name}</TableCell>
                      <TableCell>{review.whatsapp || "-"}</TableCell>
                      <TableCell>{review.product?.name || "(product removed)"}</TableCell>
                      <TableCell>{review.rating}</TableCell>
                      <TableCell style={{ maxWidth: 240, whiteSpace: "pre-line" }}>{review.comment}</TableCell>
                      <TableCell>{review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-KE") : ""}</TableCell>
                      <TableCell>
                        {review.isApproved ? (
                          <Typography color="success.main" fontWeight={600}>
                            Approved
                          </Typography>
                        ) : (
                          <Typography color="warning.main" fontWeight={600}>
                            Pending
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {!review.isApproved && (
                          <Tooltip title="Approve">
                            <span>
                              <IconButton aria-label="Approve review" color="success" disabled={actionLoading === review._id} onClick={() => handleApprove(review._id)}>
                                <CheckCircleIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <span>
                            <IconButton aria-label="Delete review" color="error" disabled={actionLoading === review._id} onClick={() => handleDelete(review._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalReviews}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
            />
          </>
        )}

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
