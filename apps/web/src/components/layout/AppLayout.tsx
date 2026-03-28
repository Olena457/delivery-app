import { Link as RouterLink, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { ShoppingCart, Store, History } from "lucide-react";

export function AppLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: { xs: 1, sm: 0 },
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            Delivery App
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            startIcon={<Store size={18} />}
          >
            Shops
          </Button>
          <Button
            component={RouterLink}
            to="/cart"
            color="inherit"
            startIcon={<ShoppingCart size={18} />}
          >
            Cart
          </Button>
          <Button
            component={RouterLink}
            to="/orders"
            color="inherit"
            startIcon={<History size={18} />}
          >
            Orders
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 3 }, flex: 1 }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
