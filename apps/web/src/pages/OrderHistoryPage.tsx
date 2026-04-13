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
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  useLazyGetOrdersByEmailQuery,
  useRequestCodeMutation,
  useVerifyCodeMutation,
} from "../store/api/shopApi";
import { mergeReorderFromOrder } from "../store/slices/cartSlice";
import { setOrders } from "../store/slices/ordersSlice";
import { setToken, setUserData } from "../store/slices/userSlice"; 
import type { OrderHistoryItem } from "../types/types";
import { AuthModal } from "../components/cart/AuthModal";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const savedUser = useAppSelector((s) => s.user.info);
  const savedOrders = useAppSelector((s) => s.orders.history);

  const [email, setEmail] = useState(savedUser?.userEmail ?? "");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // API Hooks
  const [fetchOrders, { isFetching, error }] = useLazyGetOrdersByEmailQuery();
  const [requestCode, { isLoading: isSending }] = useRequestCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLoadClick = () => {
    if (!email.trim()) return;
    setIsAuthOpen(true);
  };

 

  const onSendCode = async () => {
    setAuthError(null);
    try {
      await requestCode({ email: email.trim() }).unwrap();
      setIsCodeSent(true);
    } catch (e: unknown) {
      console.error("Failed to send code", e);

      const error = e as {
        status?: number | string;
        data?: { message?: string | string[] };
      };

      const serverMessage = Array.isArray(error.data?.message)
        ? error.data.message[0]
        : error.data?.message;

      if (error.status === 404) {
        setAuthError(
         "No account found with this email. Please enter the correct address to receive your code.",
        );
      } else if (error.status === 429) {
        setAuthError("Too many requests. Please try again in a few minutes.");
      } else if (serverMessage?.includes("Cannot POST")) {
        setAuthError("Server configuration error. Please contact support.");
      } else {
        setAuthError(
          serverMessage ||
            "Something went wrong. Check your internet connection.",
        );
      }
    }
  };


  const onVerifyCode = async (code: string) => {
    try {
      const authResult = await verifyCode({
        email: email.trim(),
        code,
      }).unwrap();

      dispatch(setToken(authResult.access_token));

      dispatch(
        setUserData({
          userEmail: email.trim(),
          userName: savedUser?.userName ?? "",
          userPhone: savedUser?.userPhone ?? "",
          address: savedUser?.address ?? "",
        }),
      );

      const orders = await fetchOrders(email.trim()).unwrap();
      dispatch(setOrders(orders));

      setIsAuthOpen(false);
      setIsCodeSent(false);
    } catch (e) {
      console.error("Verification failed", e);
    }
  };

  const handleReorder = (order: OrderHistoryItem) => {
    dispatch(mergeReorderFromOrder(order));
    navigate("/cart");
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", width: "100%", p: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Order history
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Enter the email used at checkout to receive a verification code and
        access your history.
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
          disabled={isFetching}
        />
        <Button
          variant="contained"
          onClick={handleLoadClick}
          disabled={isFetching || !email.trim()}
        >
          {isFetching ? "Loading..." : "Load orders"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load orders. Please check your connection or try again.
        </Alert>
      )}

      {savedOrders.length === 0 && !isFetching && !error && (
        <Typography color="text.secondary">
          No orders found. Enter your email and click "Load orders".
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {savedOrders.map((order) => (
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
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  alignItems: "baseline",
                }}
              >
                <Typography component="span" fontWeight={600}>
                  Order #{order.id}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  · {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Chip
                label={order.status}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {order.address}
            </Typography>

            <Divider sx={{ my: 1 }} />

            {order.items.map((line) => (
              <Typography key={line.id} variant="body2">
                {line.product.title} U+00d7 {line.quantity} : {" "}
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

      <AuthModal
        open={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setIsCodeSent(false);
          setAuthError(null);
        }}
        email={email}
        setEmail={setEmail}
        onSendCode={onSendCode}
        onVerifyCode={onVerifyCode}
        isCodeSent={isCodeSent}
        isLoading={isSending || isVerifying}
        error={authError}
      />
    </Box>
  );
}
