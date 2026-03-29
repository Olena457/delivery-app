import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  startTransition, 
} from "react";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
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
import type { Product, ProductSort } from "../types/types";
import { ProductCard } from "../components/products/ProductCard";
import { ProductFilters } from "../components/products/ProductFilters";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import {
  PAGE_SIZE,
  DEFAULT_RATING_RANGE,
} from "../utils/constants/api.constants";

import { SidebarContent } from "../components/shops/ShopSidebar";
import { PageLoader } from "../components/common/PageLoader";

export default function ShopsPage() {
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

  const [debouncedRating, setDebouncedRating] = useState(ratingRange);

  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setDebouncedRating(ratingRange);
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [ratingRange]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // --- API Queries ---
  const { data: shops = [], isLoading: shopsLoading } = useGetShopsQuery({
    minRating: debouncedRating[0],
    maxRating: debouncedRating[1],
  });

  const { data: categories = [] } = useGetCategoriesQuery();

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

  // --- Handlers (with startTransition) ---

  const handleShopSelect = useCallback((id: number) => {
    startTransition(() => {
      setSelectedShopId(id);
      setPage(1);
      setMobileOpen(false);
    });
  }, []);

  const handleCategoryChange = useCallback((id: number | undefined) => {
    startTransition(() => {
      setCategoryId(id);
      setPage(1);
    });
  }, []);

  const handleSortChange = useCallback((newSort: ProductSort) => {
    startTransition(() => {
      setSort(newSort);
      setPage(1);
    });
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

  // --- Infinite Scroll ---
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !pageData?.hasMore) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetching) {
          startTransition(() => {
            setPage((p) => p + 1);
          });
        }
      },
      { rootMargin: "400px" }, 
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [pageData?.hasMore, isFetching]);

  return (
    <Box sx={{ flexGrow: 1, minWidth: 0, minHeight: "80vh" }}>
      {/* <Box sx={{ p: { xs: 2, md: 3 } }}> */}
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
              <SidebarContent
                ratingRange={ratingRange}
                setRatingRange={handleRatingChange}
                shopsLoading={shopsLoading}
                shops={shops}
                selectedShopId={activeShopId}
                onSelectShop={handleShopSelect}
              />
            </Paper>
          </Box>
        )}

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {!activeShopId && shopsLoading ? (
            <PageLoader />
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
                <PageLoader />
              ) : (
                <>
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
                        <ProductCard
                          product={product}
                          onAdd={handleAddToCart}
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Infinite Scroll */}
                  <Box ref={sentinelRef} sx={{ height: 50, my: 2 }} />

                  {isFetching && products.length > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={!isMdUp && mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: { width: { xs: 280, sm: 400 } },
          },
        }}
      >
        <SidebarContent
          ratingRange={ratingRange}
          setRatingRange={handleRatingChange}
          shopsLoading={shopsLoading}
          shops={shops}
          selectedShopId={activeShopId}
          onSelectShop={handleShopSelect}
        />
      </Drawer>
    </Box>
  );
}
