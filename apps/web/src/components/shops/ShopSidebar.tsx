import { Box, Typography, Slider, CircularProgress } from "@mui/material";
import { ShopList } from "./ShopList";
import type { Shop } from "../../types/types";

interface ShopSidebarProps {
  ratingRange: [number, number];
  setRatingRange: (v: [number, number]) => void;
  shopsLoading: boolean;
  shops: Shop[];
  selectedShopId: number | null;
  onSelectShop: (id: number) => void;
}

export function ShopSidebar({
  ratingRange,
  setRatingRange,
  shopsLoading,
  shops,
  selectedShopId,
  onSelectShop,
}: ShopSidebarProps) {
  return (
    <Box sx={{ pr: { md: 1 } }}>
      <Typography variant="subtitle2" gutterBottom>
        Shop rating ({ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)})
      </Typography>
      <Slider
        value={ratingRange}
        onChange={(_, v) => setRatingRange(v as [number, number])}
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
          selectedId={selectedShopId}
          onSelect={onSelectShop}
        />
      )}
    </Box>
  );
}
