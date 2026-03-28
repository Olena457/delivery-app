import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useLazyGetOrdersByEmailQuery } from "../store/api/shopApi";
import { mergeReorderFromOrder } from "../store/slices/cartSlice";
import type { OrderHistoryItem } from "../types/types";

export function OrderHistoryPage() {
  const dispatch = useAppDispatch();
  const savedUser = useAppSelector((s) => s.user.info);

  const [email, setEmail] = useState(savedUser?.userEmail ?? "");
  const [fetchOrders, { data: orders, isFetching, error, isSuccess }] =
    useLazyGetOrdersByEmailQuery();

  const handleLoad = () => {
    if (!email.trim()) return;
    fetchOrders(email);
  };

  const handleReorder = (order: OrderHistoryItem) => {
    dispatch(mergeReorderFromOrder(order));
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Order history
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Enter the email used at checkout, then load your past orders. Use
        Reorder to copy line items and quantities into the cart.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ minWidth: 280 }}
        />
        <Button variant="contained" onClick={handleLoad} disabled={isFetching}>
          Load orders
        </Button>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load orders.
        </Alert>
      ) : null}

      {isSuccess && orders && orders.length === 0 ? (
        <Typography color="text.secondary">No orders for this email.</Typography>
      ) : null}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {(orders ?? []).map((order) => (
          <Paper key={order.id} variant="outlined" sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "baseline" }}>
                <Typography component="span" fontWeight={600}>
                  Order #{order.id}
                </Typography>
                <Typography component="span" variant="body2" color="text.secondary">
                  · {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Chip label={order.status} size="small" variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {order.address}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {order.items.map((line) => (
              <Typography key={line.id} variant="body2">
                {line.product.title} × {line.quantity} —{" "}
                {(line.product.price * line.quantity).toFixed(2)} ₴
              </Typography>
            ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography fontWeight={700}>
                Total: {order.totalPrice.toFixed(2)} ₴
              </Typography>
              <Button variant="outlined" onClick={() => handleReorder(order)}>
                Reorder
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
