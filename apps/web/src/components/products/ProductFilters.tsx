
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { Category, ProductSort } from "../../types/types";
import { memo } from "react";

type Props = {
  categories: Category[];
  categoryId: number | undefined;
  onCategoryChange: (id: number | undefined) => void;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
};

export const ProductFilters = memo(function ProductFilters({
  categories,
  categoryId,
  onCategoryChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      {/* Category filter */}
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography variant="subtitle2" gutterBottom>
          Category
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          <Chip
            label="All"
            color={categoryId == null ? "primary" : "default"}
            variant={categoryId == null ? "filled" : "outlined"}
            onClick={() => onCategoryChange(undefined)}
          />
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              color={categoryId === c.id ? "primary" : "default"}
              variant={categoryId === c.id ? "filled" : "outlined"}
              onClick={() => onCategoryChange(c.id)}
            />
          ))}
        </Box>
      </Box>

      {/* Sort filter */}
      <FormControl sx={{ minWidth: 220 }} size="small">
        <InputLabel
          id="sort-label"
          sx={{
            color: "text.secondary",
            "&.Mui-focused": {
              color: "primary.main",
            },
          }}
        >
          Sort
        </InputLabel>
        <Select
          labelId="sort-label"
          label="Sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as ProductSort)}
        >
          <MenuItem value="price_asc">Price: low to high</MenuItem>
          <MenuItem value="price_desc">Price: high to low</MenuItem>
          <MenuItem value="title_asc">Name: A → Z</MenuItem>
          <MenuItem value="title_desc">Name: Z → A</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
});
