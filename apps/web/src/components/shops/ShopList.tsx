
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Rating,
  Chip,
} from "@mui/material";
import type { Shop } from "../../types/types";

type Props = {
  shops: Shop[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export function ShopList({ shops, selectedId, onSelect }: Props) {
  return (
    <List dense disablePadding sx={{ width: "100%" }}>
      {shops.map((shop, index) => (
        <ListItemButton
          key={`${shop.id}-${index}`}
          selected={selectedId === shop.id}
          onClick={() => onSelect(shop.id)}
          alignItems="flex-start"
          sx={{
            borderRadius: 1,
            mb: 1,
            border: "1px solid",
            borderColor: selectedId === shop.id ? "primary.main" : "divider",
            transition: "border-color 0.2s ease-in-out",
            "&:hover": {
              borderColor: selectedId === shop.id ? "primary.main" : "grey.400",
            },
            "&.Mui-selected": {
              bgcolor: "rgba(211, 47, 47, 0.04)",
              "&:hover": {
                bgcolor: "rgba(211, 47, 47, 0.08)",
              },
            },
          }}

        >
          <ListItemText
            primary={shop.name}
            slotProps={{
              secondary: { component: "div" },
            }}
            secondary={
              <Box sx={{ mt: 0.5 }}>
                {shop.description ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {shop.description.length > 90
                      ? `${shop.description.slice(0, 90)}…`
                      : shop.description}
                  </Typography>
                ) : null}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.75,
                    flexWrap: "wrap",
                  }}
                >
                  <Rating
                    value={shop.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {shop.rating?.toFixed(1) || "0.0"}
                  </Typography>

                  {shop._count?.reviews != null && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${shop._count.reviews} reviews`}
                    />
                  )}
                </Box>
              </Box>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
}
