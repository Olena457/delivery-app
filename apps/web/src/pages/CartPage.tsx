import { useState } from "react";
import {
  Alert,
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import { CheckoutForm } from "../components/cart/CheckoutForm";
import { useCreateOrderMutation } from "../store/api/shopApi";
import {
  setUserData,
  setLastOrder,
  addOrderToHistory,
} from "../store/slices/userSlice";

import { ConfirmClearCartModal } from "../components/cart/ConfirmClearCartModal";
import { PageLoader } from "../components/common/PageLoader";


export default function CartPage() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart);
  const userInfo = useAppSelector((s) => s.user.info);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  if (isLoading) {
    return <PageLoader />;
  }

  const lines = cart.items.map((i) => ({
    productId: i.id,
    quantity: i.quantity,
  }));

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        width: "100%",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.25rem", sm: "2rem" },
          }}
        >
          Shopping cart
        </Typography>

        {cart.items.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            Clear Cart
          </Button>
        )}
      </Box>

      {cart.items.length === 0 ? (
        <Typography color="text.secondary">Your cart is empty.</Typography>
      ) : (
        <Paper variant="outlined" sx={{ py: 2, px: 4, mb: 3 }}>
          {cart.items.map((item, index) => (
            <Box key={`${item.id}-${index}`}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  py: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ flex: "1 1 200px" }}>
                  <Typography fontWeight={600}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.price.toFixed(2)} ₴ each
                  </Typography>
                </Box>

                <TextField
                  label="Quantity"
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") return;
                    let q = Number(val);
                    if (Number.isNaN(q)) return;
                    if (q < 1) q = 1;
                    dispatch(updateQuantity({ id: item.id, quantity: q }));
                  }}
                  sx={{ width: 88 }}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                      type: "number",
                      inputMode: "numeric",
                    },
                  }}
                />

                <Typography sx={{ minWidth: 90, alignSelf: "center" }}>
                  {(item.price * item.quantity).toFixed(2)} ₴
                </Typography>
                <IconButton
                  aria-label="Remove"
                  color="error"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Box>
              <Divider />
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary">
              {cart.totalPrice.toFixed(2)} ₴
            </Typography>
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Could not place order. Check the form and try again.
        </Alert>
      )}

      <Typography
        variant="h6"
        gutterBottom
        sx={{ mt: cart.items.length ? 3 : 0 }}
      >
        Checkout
      </Typography>

      <CheckoutForm
        defaultValues={userInfo ?? undefined}
        cartLines={lines}
        totalPrice={cart.totalPrice}
        disabled={isLoading}
        onSubmitOrder={async (dto) => {
          const order = await createOrder(dto).unwrap();
          dispatch(
            setUserData({
              userName: dto.userName,
              userEmail: dto.userEmail,
              userPhone: dto.userPhone,
              address: dto.address,
            }),
          );
          dispatch(setLastOrder(order.id));
          dispatch(addOrderToHistory(order.id));
          dispatch(clearCart());
        }}
      />

      <ConfirmClearCartModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => dispatch(clearCart())}
      />
    </Box>
  );
}