import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  CreateOrderDto,
  OrderHistoryItem,
  HistoryResponse,
} from "../../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Orders", "Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),

    getOrderById: builder.query<OrderHistoryItem, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),

    getOrdersByEmail: builder.query<HistoryResponse, string>({
      query: (email) => `/orders/history?email=${email}`,
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation<
      { success: boolean; orderId: number },
      CreateOrderDto
    >({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    updateOrder: builder.mutation<
      OrderHistoryItem,
      { id: number; data: Partial<CreateOrderDto> }
    >({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Orders",
        { type: "Orders", id },
      ],
    }),

    deleteOrder: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetOrderByIdQuery,
  useGetOrdersByEmailQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = shopApi;
