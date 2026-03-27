import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type{ UserState, UserInfo } from "../../types/types";

const initialState: UserState = {
  info: null,
  orderHistory: [],
  lastOrderId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
    },
    setLastOrder: (state, action: PayloadAction<number>) => {
      state.lastOrderId = action.payload;
    },
    addOrderToHistory: (state, action: PayloadAction<number>) => {
      state.orderHistory.unshift(action.payload);
      if (state.orderHistory.length > 5) {
        state.orderHistory = state.orderHistory.slice(0, 5);
      }
    },
    clearUser: (state) => {
      state.info = null;
      state.lastOrderId = null;
      state.orderHistory = [];
    },
  },
});

export const { setUserData, setLastOrder, addOrderToHistory, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
