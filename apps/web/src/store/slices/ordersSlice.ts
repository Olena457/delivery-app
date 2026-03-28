import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { OrderHistoryItem } from "../../types/types";

interface OrdersState {
  history: OrderHistoryItem[];
}

const initialState: OrdersState = {
  history: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderHistoryItem[]>) => {
      state.history = action.payload.slice(0, 6); // тільки останні 6
    },
    addOrder: (state, action: PayloadAction<OrderHistoryItem>) => {
      state.history.unshift(action.payload);
      state.history = state.history.slice(0, 6);
    },
    clearOrders: (state) => {
      state.history = [];
    },
  },
});

export const { setOrders, addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
