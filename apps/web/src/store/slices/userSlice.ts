import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserState, UserInfo } from "../../types/types";

const initialState: UserState & { token: string | null } = {
  info: null,
  orderHistory: [],
  lastOrderId: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLastOrder: (state, action: PayloadAction<number>) => {
      state.lastOrderId = action.payload;
    },
    addOrderToHistory: (state, action: PayloadAction<number>) => {
      state.orderHistory.unshift(action.payload);
      if (state.orderHistory.length > 6) {
        state.orderHistory = state.orderHistory.slice(0, 6);
      }
    },
    clearUser: (state) => {
      state.info = null;
      state.lastOrderId = null;
      state.orderHistory = [];
      state.token = null;
    },
  },
});

export const { setUserData, setLastOrder, addOrderToHistory, clearUser, setToken } =
  userSlice.actions;

export default userSlice.reducer;
