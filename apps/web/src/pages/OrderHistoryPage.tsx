
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
  const currentToken = useAppSelector((s) => s.user.token);

  const [email, setEmail] = useState(savedUser?.userEmail ?? "");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // API Hooks
  const [fetchOrders, { isFetching, error }] = useLazyGetOrdersByEmailQuery();
  const [requestCode, { isLoading: isSending }] = useRequestCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLoadClick = () => {
    
    if (currentToken) {
      loadOrdersFlow();
    } else {
      setIsAuthOpen(true);
    }
  };

  const loadOrdersFlow = async () => {
    try {
      const orders = await fetchOrders().unwrap();
      dispatch(setOrders(orders));
    } catch (e) {
      console.error("Failed to load orders", e);
    }
  };

 const onSendCode = async () => {
   setAuthError(null);
   try {
     await requestCode({ email: email.trim() }).unwrap();
     setIsCodeSent(true);
   } catch (e: unknown) {
     console.error("Failed to send code", e);

     const error = e as { data?: { message?: string } };

     setAuthError(
       error.data?.message || "Failed to send code. Check your email.",
     );
   }
 };

  const onVerifyCode = async (code: string) => {
    setAuthError(null);
    try {
      // get token
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

      await loadOrdersFlow();

      setIsAuthOpen(false);
      setIsCodeSent(false);
    } catch (e: unknown) {
      console.error("Verification failed", e);
      const error = e as { data?: { message?: string } };
      setAuthError(error.data?.message || "Invalid or expired code.");
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
        Enter your email to access your order history via verification code.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
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
          sx={{
            background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)",
          }}
        >
          {isFetching ? "Loading..." : "Load orders"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load orders. Please log in again.
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {savedOrders.map((order) => (
          <Paper
            key={order.id}
            variant="outlined"
            sx={{ p: 2, borderRadius: 2 }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography fontWeight={700}>Order #{order.id}</Typography>
              <Chip
                label={order.status}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            {order.items.map((item) => (
              <Typography key={item.id} variant="body2">
                {item.product.title} × {item.quantity}
              </Typography>
            ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                alignItems: "center",
              }}
            >
              <Typography fontWeight={700}>
                Total: {order.totalPrice.toFixed(2)} ₴
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleReorder(order)}
              >
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