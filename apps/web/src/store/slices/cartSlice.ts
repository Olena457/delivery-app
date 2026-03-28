import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, OrderHistoryItem, Product } from "../../types/types";

interface CartState {
  items: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
};

function recalcTotal(state: CartState) {
  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      recalcTotal(state);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      recalcTotal(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      } else if (item && quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      }

      recalcTotal(state);
    },

    mergeReorderFromOrder: (state, action: PayloadAction<OrderHistoryItem>) => {
      for (const line of action.payload.items) {
        const p = line.product;
        const cartProduct: Product = {
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.image,
          categoryId: p.categoryId,
          shopId: p.shopId,
          category: p.category,
        };
        const existing = state.items.find((i) => i.id === cartProduct.id);
        if (existing) {
          existing.quantity += line.quantity;
        } else {
          state.items.push({ ...cartProduct, quantity: line.quantity });
        }
      }
      recalcTotal(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  mergeReorderFromOrder,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
