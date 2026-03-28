import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { checkoutFieldsSchema } from "../../schemas/orderSchema";
import type { InferType } from "yup";
import type { CreateOrderDto } from "../../types/types";

export type CheckoutFormValues = InferType<typeof checkoutFieldsSchema>;

type Props = {
  defaultValues?: Partial<CheckoutFormValues>;
  cartLines: { productId: number; quantity: number }[];
  totalPrice: number;
  onSubmitOrder: (dto: CreateOrderDto) => Promise<void>;
  disabled?: boolean;
};

export function CheckoutForm({
  defaultValues,
  cartLines,
  totalPrice,
  onSubmitOrder,
  disabled,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: yupResolver(checkoutFieldsSchema),
    defaultValues: {
      userName: defaultValues?.userName ?? "",
      userEmail: defaultValues?.userEmail ?? "",
      userPhone: defaultValues?.userPhone ?? "",
      address: defaultValues?.address ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (cartLines.length === 0) return;
    await onSubmitOrder({
      ...values,
      items: cartLines,
      totalPrice,
    });
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      {cartLines.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Add products to submit an order.
        </Alert>
      ) : null}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label="Name"
          required
          fullWidth
          {...register("userName")}
          error={Boolean(errors.userName)}
          helperText={errors.userName?.message}
        />
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          {...register("userEmail")}
          error={Boolean(errors.userEmail)}
          helperText={errors.userEmail?.message}
        />
        <TextField
          label="Phone"
          required
          fullWidth
          inputProps={{ inputMode: "numeric" }}
          {...register("userPhone")}
          error={Boolean(errors.userPhone)}
          helperText={errors.userPhone?.message}
        />
        <TextField
          label="Address"
          required
          fullWidth
          multiline
          minRows={2}
          sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
          {...register("address")}
          error={Boolean(errors.address)}
          helperText={errors.address?.message}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={disabled || cartLines.length === 0}
        startIcon={
          disabled ? <CircularProgress size={18} color="inherit" /> : undefined
        }
      >
        Submit order
      </Button>
    </Box>
  );
}
