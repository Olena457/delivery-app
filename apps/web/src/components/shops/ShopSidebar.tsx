
import { Box, Typography, Slider, CircularProgress } from "@mui/material";
import { ShopList } from "./ShopList";
import type { Shop } from "../../types/types";
import { memo } from "react";

interface ShopSidebarProps {
  ratingRange: [number, number];
  setRatingRange: (
    event: Event | React.SyntheticEvent,
    value: number | number[],
  ) => void;
  shopsLoading: boolean;
  shops: Shop[];
  selectedShopId: number | null;
  onSelectShop: (id: number) => void;
}

export const SidebarContent = memo(function SidebarContent({
  ratingRange,
  setRatingRange,
  shopsLoading,
  shops,
  selectedShopId,
  onSelectShop,
}: ShopSidebarProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Shop rating ({ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)})
      </Typography>
      <Slider
        value={ratingRange}
        onChange={(event, v) => setRatingRange(event, v)}
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
        <Box sx={{ display: "flex", py: 2 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <ShopList
          shops={shops}
          selectedId={selectedShopId}
          onSelect={onSelectShop}
        />
      )}
    </Box>
  );
});