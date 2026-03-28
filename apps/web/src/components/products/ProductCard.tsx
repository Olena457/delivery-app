import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import type { Product } from "../../types/types";
import defaultProductImage from "../../assets/bart.jpg";

type Props = {
  product: Product;
  onAdd: (product: Product) => void;
};
export function ProductCard({ product, onAdd }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {product.image ? (
        <CardMedia
          component="img"
          height="160"
          image={product.image || defaultProductImage}
          alt={product.title}
          sx={{ objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultProductImage;
          }}
        />
       
      ) : (
        <Box
          sx={{
            height: 160,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">No image</Typography>
        </Box>
      )}
      <CardContent sx={{ flex: 1 }}>
        {product.category?.name ? (
          <Chip size="small" label={product.category.name} sx={{ mb: 1 }} />
        ) : null}
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
}
