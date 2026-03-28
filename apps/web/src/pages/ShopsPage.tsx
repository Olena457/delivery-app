// import { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   CircularProgress,
//   Drawer,
//   IconButton,
//   Slider,
//   Typography,
//   Grid,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { Menu } from "lucide-react";
// import {
//   useGetShopsQuery,
//   useGetCategoriesQuery,
//   useGetProductsQuery,
// } from "../store/api/shopApi";
// import type { Product } from "../types/types";
// import type { ProductSort } from "../types/types";
// import { ShopList } from "../components/shops/ShopList";
// import { ProductCard } from "../components/products/ProductCard";
// import { ProductFilters } from "../components/products/ProductFilters";
// import { useAppDispatch } from "../store/hooks";
// import { addToCart } from "../store/slices/cartSlice";

// const PAGE_SIZE = 12;

// export function ShopsPage() {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const dispatch = useAppDispatch();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
//   const [categoryId, setCategoryId] = useState<number | undefined>();
//   const [sort, setSort] = useState<ProductSort>("title_asc");
//   const [ratingRange, setRatingRange] = useState<[number, number]>([1, 5]);
//   const [page, setPage] = useState(1);
//   const [productRows, setProductRows] = useState<Product[]>([]);

//   const sentinelRef = useRef<HTMLDivElement | null>(null);

//   const { data: shops = [], isLoading: shopsLoading } = useGetShopsQuery({
//     minRating: ratingRange[0],
//     maxRating: ratingRange[1],
//   });

//   const { data: categories = [] } = useGetCategoriesQuery();

//   const { data: pageData, isFetching } = useGetProductsQuery(
//     {
//       shopId: selectedShopId!,
//       categoryId,
//       sort,
//       page,
//       limit: PAGE_SIZE,
//     },
//     { skip: !selectedShopId },
//   );

//   useEffect(() => {
//     if (!shops.length) return;
//     if (
//       selectedShopId == null ||
//       !shops.some((s) => s.id === selectedShopId)
//     ) {
//       setSelectedShopId(shops[0].id);
//     }
//   }, [shops, selectedShopId]);

//   useEffect(() => {
//     setPage(1);
//     setProductRows([]);
//   }, [selectedShopId, categoryId, sort]);

//   useEffect(() => {
//     if (!pageData?.data) return;
//     if (page === 1) setProductRows(pageData.data);
//     else setProductRows((prev) => [...prev, ...pageData.data]);
//   }, [pageData, page]);

//   useEffect(() => {
//     const el = sentinelRef.current;
//     if (!el || !selectedShopId || !pageData?.hasMore || isFetching) return;
//     const obs = new IntersectionObserver(
//       (entries) => {
//         if (entries[0]?.isIntersecting) {
//           setPage((p) => p + 1);
//         }
//       },
//       { rootMargin: "240px" },
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [selectedShopId, pageData?.hasMore, isFetching, pageData]);

//   const sidebar = (
//     <Box sx={{ pr: { md: 1 } }}>
//       <Typography variant="subtitle2" gutterBottom>
//         Shop rating ({ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)})
//       </Typography>
//       <Slider
//         value={ratingRange}
//         onChange={(_, v) => setRatingRange(v as [number, number])}
//         min={1}
//         max={5}
//         step={0.1}
//         valueLabelDisplay="auto"
//         disableSwap
//         sx={{ mb: 2 }}
//       />
//       <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//         Shops
//       </Typography>
//       {shopsLoading ? (
//         <CircularProgress size={28} />
//       ) : (
//         <ShopList
//           shops={shops}
//           selectedId={selectedShopId}
//           onSelect={(id) => {
//             setSelectedShopId(id);
//             if (!isMdUp) setMobileOpen(false);
//           }}
//         />
//       )}
//     </Box>
//   );

//   return (
//     <Box>
//       {!isMdUp ? (
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//           <IconButton
//             aria-label="open shops"
//             onClick={() => setMobileOpen(true)}
//             edge="start"
//           >
//             <Menu />
//           </IconButton>
//           <Typography variant="subtitle1">Shops & filters</Typography>
//         </Box>
//       ) : null}

//       <Grid container spacing={2}>
//         {isMdUp ? <Grid size={{ xs: 12, md: 4, lg: 3 }}>{sidebar}</Grid> : null}
//         <Grid size={{ xs: 12, md: 8, lg: 9 }}>
//           {!selectedShopId ? (
//             <Typography color="text.secondary">Loading shops…</Typography>
//           ) : (
//             <>
//               <ProductFilters
//                 categories={categories}
//                 categoryId={categoryId}
//                 onCategoryChange={setCategoryId}
//                 sort={sort}
//                 onSortChange={setSort}
//               />
//               {isFetching && productRows.length === 0 ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
//                   <CircularProgress />
//                 </Box>
//               ) : (
//                 <Grid container spacing={2}>
//                   {productRows.map((product, index) => (
//                     <Grid
//                       key={`${product.id}-${index}`}
//                       size={{ xs: 12, sm: 6, lg: 4 }}
//                     >
//                       <ProductCard
//                         product={product}
//                         onAdd={(p) => dispatch(addToCart(p))}
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>
//               )}
//               <Box ref={sentinelRef} sx={{ height: 24 }} />
//               {isFetching && productRows.length > 0 ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
//                   <CircularProgress size={28} />
//                 </Box>
//               ) : null}
//               {!isFetching && productRows.length === 0 ? (
//                 <Typography color="text.secondary">
//                   No products found.
//                 </Typography>
//               ) : null}
//             </>
//           )}
//         </Grid>
//       </Grid>

//       <Drawer
//         anchor="left"
//         open={!isMdUp && mobileOpen}
//         onClose={() => setMobileOpen(false)}
//       >
//         <Box sx={{ width: 300, p: 2 }}>{sidebar}</Box>
//       </Drawer>
//     </Box>
//   );
// }

// second variant_____________________________________

// import { useState, useCallback, useMemo, useRef, useEffect } from "react";
// import {
//   Box,
//   CircularProgress,
//   Drawer,
//   IconButton,
//   Slider,
//   Typography,
//   Paper,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { Menu } from "lucide-react";

// import {
//   useGetShopsQuery,
//   useGetCategoriesQuery,
//   useGetProductsQuery,
// } from "../store/api/shopApi";
// import type { ProductSort } from "../types/types";
// import { ShopList } from "../components/shops/ShopList";
// import { ProductCard } from "../components/products/ProductCard";
// import { ProductFilters } from "../components/products/ProductFilters";
// import { useAppDispatch } from "../store/hooks";
// import { addToCart } from "../store/slices/cartSlice";
// import {
//   PAGE_SIZE,
//   DEFAULT_RATING_RANGE,
// } from "../utils/constants/api.constants";

// export function ShopsPage() {
//   const theme = useTheme();
//   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
//   const dispatch = useAppDispatch();

//   // --- State ---
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
//   const [categoryId, setCategoryId] = useState<number | undefined>();
//   const [sort, setSort] = useState<ProductSort>("title_asc");
//   const [ratingRange, setRatingRange] =
//     useState<[number, number]>(DEFAULT_RATING_RANGE);
//   const [page, setPage] = useState(1);

//   const sentinelRef = useRef<HTMLDivElement | null>(null);

//   // --- API Queries ---
//   const { data: shops = [], isLoading: shopsLoading } = useGetShopsQuery({
//     minRating: ratingRange[0],
//     maxRating: ratingRange[1],
//   });

//   const { data: categories = [] } = useGetCategoriesQuery();

//   const activeShopId = useMemo(() => {
//     return selectedShopId ?? (shops.length > 0 ? shops[0].id : null);
//   }, [selectedShopId, shops]);

//   const { data: pageData, isFetching } = useGetProductsQuery(
//     {
//       shopId: activeShopId!,
//       categoryId,
//       sort,
//       page,
//       limit: PAGE_SIZE,
//     },
//     { skip: !activeShopId },
//   );

//   // Отримуємо товари напряму з API без додаткового локального масиву
//   const products = pageData?.data || [];

//   // --- Handlers ---
//   const handleShopSelect = (id: number) => {
//     setSelectedShopId(id);
//     setPage(1); // Скидаємо лише сторінку
//     if (!isMdUp) setMobileOpen(false);
//   };

//   const handleCategoryChange = (id: number | undefined) => {
//     setCategoryId(id);
//     setPage(1);
//   };

//   const handleSortChange = (newSort: ProductSort) => {
//     setSort(newSort);
//     setPage(1);
//   };

//   // Infinite Scroll logic (якщо ти хочеш залишати пагінацію через скрол)
//   useEffect(() => {
//     const el = sentinelRef.current;
//     if (!el || !pageData?.hasMore || isFetching) return;

//     const obs = new IntersectionObserver(
//       (entries) => {
//         if (entries[0]?.isIntersecting) {
//           setPage((p) => p + 1);
//         }
//       },
//       { rootMargin: "200px" },
//     );

//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [pageData?.hasMore, isFetching]);

//   const sidebar = (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="subtitle2" gutterBottom>
//         Shop rating ({ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)})
//       </Typography>
//       <Slider
//         value={ratingRange}
//         onChange={(_, v) => {
//           setRatingRange(v as [number, number]);
//           setPage(1);
//         }}
//         min={1}
//         max={5}
//         step={0.1}
//         valueLabelDisplay="auto"
//         disableSwap
//         sx={{ mb: 2 }}
//       />
//       <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//         Shops
//       </Typography>
//       {shopsLoading ? (
//         <CircularProgress size={28} />
//       ) : (
//         <ShopList
//           shops={shops}
//           selectedId={activeShopId}
//           onSelect={handleShopSelect}
//         />
//       )}
//     </Box>
//   );

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 } }}>
//       {!isMdUp && (
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
//           <IconButton onClick={() => setMobileOpen(true)} edge="start">
//             <Menu />
//           </IconButton>
//           <Typography variant="subtitle1">Shops & filters</Typography>
//         </Box>
//       )}

//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           gap: 3,
//         }}
//       >
//         {isMdUp && (
//           <Box sx={{ width: { md: "280px", lg: "320px" }, flexShrink: 0 }}>
//             <Paper variant="outlined" sx={{ borderRadius: 2 }}>
//               {sidebar}
//             </Paper>
//           </Box>
//         )}

//         <Box sx={{ flexGrow: 1, minWidth: 0 }}>
//           {!activeShopId ? (
//             <Typography color="text.secondary">Loading shops...</Typography>
//           ) : (
//             <Box>
//               <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//                 <ProductFilters
//                   categories={categories}
//                   categoryId={categoryId}
//                   onCategoryChange={handleCategoryChange}
//                   sort={sort}
//                   onSortChange={handleSortChange}
//                 />
//               </Paper>

//               {isFetching && products.length === 0 ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
//                   <CircularProgress />
//                 </Box>
//               ) : (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: 2,
//                   }}
//                 >
//                   {products.map((product) => (
//                     <Box
//                       key={product.id}
//                       sx={{
//                         width: {
//                           xs: "100%",
//                           sm: "calc(50% - 8px)",
//                           lg: "calc(33.333% - 11px)",
//                         },
//                       }}
//                     >
//                       <ProductCard
//                         product={product}
//                         onAdd={(p) => dispatch(addToCart(p))}
//                       />
//                     </Box>
//                   ))}
//                 </Box>
//               )}

//               <Box ref={sentinelRef} sx={{ height: 20, my: 2 }} />
//             </Box>
//           )}
//         </Box>
//       </Box>

//       <Drawer
//         anchor="left"
//         open={!isMdUp && mobileOpen}
//         onClose={() => setMobileOpen(false)}
//         PaperProps={{ sx: { width: 300 } }}
//       >
//         {sidebar}
//       </Drawer>
//     </Box>
//   );
// }
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Slider,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu } from "lucide-react";

import {
  useGetShopsQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "../store/api/shopApi";
import type {  Product,ProductSort } from "../types/types";
import { ShopList } from "../components/shops/ShopList";
import { ProductCard } from "../components/products/ProductCard";
import { ProductFilters } from "../components/products/ProductFilters";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import {
  PAGE_SIZE,
  DEFAULT_RATING_RANGE,
} from "../utils/constants/api.constants";

export function ShopsPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useAppDispatch();

  // --- State ---
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [sort, setSort] = useState<ProductSort>("title_asc");
  const [ratingRange, setRatingRange] =
    useState<[number, number]>(DEFAULT_RATING_RANGE);
  const [page, setPage] = useState(1);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // --- API Queries ---
  const { data: shops = [], isLoading: shopsLoading } = useGetShopsQuery({
    minRating: ratingRange[0],
    maxRating: ratingRange[1],
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  // Використовуємо useMemo для визначення активного магазину
  const activeShopId = useMemo(() => {
    return selectedShopId ?? (shops.length > 0 ? shops[0].id : null);
  }, [selectedShopId, shops]);

  const { data: pageData, isFetching } = useGetProductsQuery(
    {
      shopId: activeShopId!,
      categoryId,
      sort,
      page,
      limit: PAGE_SIZE,
    },
    { skip: !activeShopId },
  );

  const products = pageData?.data || [];

  // --- Handlers (Огорнуті в useCallback) ---

  const handleShopSelect = useCallback((id: number) => {
    setSelectedShopId(id);
    setPage(1);
    setMobileOpen(false);
  }, []); // Порожній масив, бо залежності не змінюються

  const handleCategoryChange = useCallback((id: number | undefined) => {
    setCategoryId(id);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: ProductSort) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handleRatingChange = useCallback(
    (_: Event | React.SyntheticEvent, v: number | number[]) => {
      setRatingRange(v as [number, number]);
      setPage(1);
    },
    [],
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
    },
    [dispatch],
  );
  // --- Effects ---

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !pageData?.hasMore || isFetching) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [pageData?.hasMore, isFetching]);

  // --- Render Helpers ---

  const sidebar = (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Shop rating ({ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)})
      </Typography>
      <Slider
        value={ratingRange}
        onChange={handleRatingChange}
        min={1}
        max={5}
        step={0.1}
        valueLabelDisplay="auto"
        disableSwap
        sx={{ mb: 2 }}
      />
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Shops
      </Typography>
      {shopsLoading ? (
        <CircularProgress size={28} />
      ) : (
        <ShopList
          shops={shops}
          selectedId={activeShopId}
          onSelect={handleShopSelect}
        />
      )}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {!isMdUp && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <IconButton onClick={() => setMobileOpen(true)} edge="start">
            <Menu />
          </IconButton>
          <Typography variant="subtitle1">Shops & filters</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {isMdUp && (
          <Box sx={{ width: { md: "280px", lg: "320px" }, flexShrink: 0 }}>
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, position: "sticky", top: 20 }}
            >
              {sidebar}
            </Paper>
          </Box>
        )}

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {!activeShopId ? (
            <Typography color="text.secondary">Loading shops...</Typography>
          ) : (
            <Box>
              <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <ProductFilters
                  categories={categories}
                  categoryId={categoryId}
                  onCategoryChange={handleCategoryChange}
                  sort={sort}
                  onSortChange={handleSortChange}
                />
              </Paper>

              {isFetching && products.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {products.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "calc(50% - 8px)",
                          lg: "calc(33.333% - 11px)",
                        },
                      }}
                    >
                      <ProductCard product={product} onAdd={handleAddToCart} />
                    </Box>
                  ))}
                </Box>
              )}
              <Box ref={sentinelRef} sx={{ height: 20, my: 2 }} />
            </Box>
          )}
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={!isMdUp && mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 300 } }}
      >
        {sidebar}
      </Drawer>
    </Box>
  );
}