
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {
//   CreateOrderDto,
//   OrderHistoryItem,
//   HistoryResponse,
//   Shop,
//   Category,
//   PaginatedProducts,
//   ProductSort,
// } from "../../types/types";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// export type ShopsQuery = {
//   minRating?: number;
//   maxRating?: number;
// };

// export type ProductsQuery = {
//   shopId: number;
//   categoryId?: number;
//   sort?: ProductSort;
//   page?: number;
//   limit?: number;
// };

// function shopsQueryString(params?: ShopsQuery) {
//   if (!params) return "";
//   const sp = new URLSearchParams();
//   if (params.minRating != null) sp.set("minRating", String(params.minRating));
//   if (params.maxRating != null) sp.set("maxRating", String(params.maxRating));
//   const q = sp.toString();
//   return q ? `?${q}` : "";
// }

// function productsQueryString(q: ProductsQuery) {
//   const sp = new URLSearchParams();
//   sp.set("shopId", String(q.shopId));
//   if (q.categoryId != null) sp.set("categoryId", String(q.categoryId));
//   if (q.sort) sp.set("sort", q.sort);
//   if (q.page != null) sp.set("page", String(q.page));
//   if (q.limit != null) sp.set("limit", String(q.limit));
//   return `?${sp.toString()}`;
// }

// export const shopApi = createApi({
//   reducerPath: "shopApi",
//   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
//   tagTypes: ["Orders", "Products", "Shops", "Categories"],
//   endpoints: (builder) => ({
//     getShops: builder.query<Shop[], ShopsQuery | void>({
//       query: (arg) => `/shops${shopsQueryString(arg ?? undefined)}`,
//       providesTags: ["Shops"],
//     }),

//     getCategories: builder.query<Category[], void>({
//       query: () => "/categories",
//       providesTags: ["Categories"],
//     }),

//     getProducts: builder.query<PaginatedProducts, ProductsQuery>({
//       query: (q) => `/products${productsQueryString(q)}`,
//       serializeQueryArgs: ({ queryArgs, endpointName }) => {
//         const args = { ...queryArgs };
//         delete args.page;
//         return `${endpointName}-${JSON.stringify(args)}`;
//       },
//       merge: (currentCache, newItems, { arg }) => {
//         if (arg.page === 1 || !currentCache) {
//           return newItems;
//         }
//         currentCache.data.push(...newItems.data);
//         currentCache.hasMore = newItems.hasMore;
//       },
//       forceRefetch({ currentArg, previousArg }) {
//         return currentArg !== previousArg;
//       },
//       providesTags: (_res, _err, arg) => [
//         {
//           type: "Products",
//           id: `${arg.shopId}-${arg.categoryId ?? "all"}-${arg.sort ?? "default"}`,
//         },
//       ],
//     }),

//     getOrderById: builder.query<OrderHistoryItem, number>({
//       query: (id) => `/orders/${id}`,
//       providesTags: (_result, _error, id) => [{ type: "Orders", id }],
//     }),

//     getOrdersByEmail: builder.query<HistoryResponse, string>({
//       query: (email) =>
//         `/orders/history?email=${encodeURIComponent(email.trim())}`,
//       providesTags: ["Orders"],
//     }),

//     createOrder: builder.mutation<OrderHistoryItem, CreateOrderDto>({
//       query: (body) => ({
//         url: "/orders",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     updateOrder: builder.mutation<
//       OrderHistoryItem,
//       { id: number; data: Partial<CreateOrderDto> }
//     >({
//       query: ({ id, data }) => ({
//         url: `/orders/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         "Orders",
//         { type: "Orders", id },
//       ],
//     }),

//     deleteOrder: builder.mutation<{ success: boolean }, number>({
//       query: (id) => ({
//         url: `/orders/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Orders"],
//     }),
//   }),
// });

// export const {
//   useGetShopsQuery,
//   useGetCategoriesQuery,
//   useGetProductsQuery,
//   useLazyGetProductsQuery,
//   useGetOrderByIdQuery,
//   useGetOrdersByEmailQuery,
//   useLazyGetOrdersByEmailQuery,
//   useCreateOrderMutation,
//   useUpdateOrderMutation,
//   useDeleteOrderMutation,
// } = shopApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateOrderDto,
  OrderHistoryItem,
  HistoryResponse,
  Shop,
  Category,
  PaginatedProducts,
  ProductSort,
} from "../../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export type ShopsQuery = {
  minRating?: number;
  maxRating?: number;
};

export type ProductsQuery = {
  shopId: number;
  categoryId?: number;
  sort?: ProductSort;
  page?: number;
  limit?: number;
};

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Orders", "Products", "Shops", "Categories"],
  endpoints: (builder) => ({
    getShops: builder.query<Shop[], ShopsQuery | void>({
      query: (params) => ({
        url: "/shops",
        params: params ?? {},
      }),
      providesTags: ["Shops"],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),

    getProducts: builder.query<PaginatedProducts, ProductsQuery>({
      query: (params) => ({
        url: "/products",
        params,
      }),
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const args = { ...queryArgs };
        delete args.page;
        return `${endpointName}-${JSON.stringify(args)}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1 || !currentCache) {
          return newItems;
        }
        currentCache.data.push(...newItems.data);
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (_res, _err, arg) => [
        {
          type: "Products",
          id: `${arg.shopId}-${arg.categoryId ?? "all"}-${arg.sort ?? "default"}`,
        },
      ],
    }),

    getOrderById: builder.query<OrderHistoryItem, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),

    getOrdersByEmail: builder.query<HistoryResponse, string>({
      query: (email) => ({
        url: "/orders/history",
        params: { email: email.trim() },
      }),
      providesTags: ["Orders"],
    }),

    createOrder: builder.mutation<OrderHistoryItem, CreateOrderDto>({
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
  useGetShopsQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetOrderByIdQuery,
  useGetOrdersByEmailQuery,
  useLazyGetOrdersByEmailQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = shopApi;
