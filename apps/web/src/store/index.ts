import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import { shopApi } from "./api/shopApi"; 
import cartReducer from "./slices/cartSlice"; 
import userReducer from "./slices/userSlice"; 
import ordersReducer from "./slices/ordersSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  orders: ordersReducer, 
  [shopApi.reducerPath]: shopApi.reducer,
});

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user", "orders"], 
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(shopApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
