
import { memo } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from "@mui/material";
import type { Product } from "../../types/types";
import defaultProductImage from "../../assets/meal.jpg";

type Props = {
  product: Product;
  onAdd: (product: Product) => void;
};

export const ProductCard = memo(function ProductCard({
  product,
  onAdd,
}: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 1,
      }}
    >
     
      <CardMedia
        component="img"
        height="185"
        image={product.image ?? defaultProductImage}
        alt={product.title}
        sx={{
          objectFit: "cover",
          bgcolor: "grey.100",
        }}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultProductImage;
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {product.category?.name && (
          <Chip size="small" label={product.category.name} sx={{ mb: 1 }} />
        )}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {product.title}
        </Typography>
        <Typography variant="h6" color="primary">
          {product.price.toFixed(2)} ₴
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={() => onAdd(product)}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
});