import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Badge,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { ShoppingCart, Store, History } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import { AiChatModal } from "../common/aimodal/AiChatModal";
import { TelegramBotButton } from "../common/telegram/TelegramBotButton"; 
import { AiChatButton } from "../common/aibutton/AiChatButton";
import logo from "../../assets/logo.svg";

export function AppLayout() {
  const location = useLocation();
  const cartItems = useAppSelector((s) => s.cart.items);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isAiOpen, setIsAiOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{ bgcolor: "white" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { sm: "space-between" },
            alignItems: { xs: "flex-start", sm: "center" },
            py: { xs: 1.5, sm: 0 },
            px: { xs: 0, sm: 6 },
            gap: { xs: 1, sm: 0 },
          }}
        >
          {/* Logo Section */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 800,
              textDecoration: "none",
              width: { xs: "100%", sm: "auto" },
              textAlign: { xs: "center", sm: "left" },
              fontSize: {
                xs: "1.1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.5rem",
              },
              whiteSpace: "nowrap",
              flexShrink: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 1.5,
              background: "linear-gradient(60deg, #fd5260 30%, #FFC371 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: { xs: 20, sm: 22, md: 32 },
                height: "auto",
              }}
            />
            Delivery App
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <AiChatButton onClick={() => setIsAiOpen(true)} />
            <TelegramBotButton />

            <Button
              component={RouterLink}
              to="/"
              startIcon={<Store size={18} />}
              color={isActive("/") ? "primary" : "inherit"}
              sx={{
                fontWeight: isActive("/") ? 600 : 500,
                borderRadius: 2,
                bgcolor: isActive("/")
                  ? "rgba(253, 82, 96, 0.12)"
                  : "transparent",
                textTransform: "none",
              }}
            >
              Shops
            </Button>

            <Button
              component={RouterLink}
              to="/cart"
              color={isActive("/cart") ? "primary" : "inherit"}
              sx={{
                fontWeight: isActive("/cart") ? 600 : 500,
                borderRadius: 2,
                bgcolor: isActive("/cart")
                  ? "rgba(253, 82, 96, 0.12)"
                  : "transparent",
                textTransform: "none",
              }}
            >
              <Badge
                badgeContent={totalQuantity}
                color="primary"
                invisible={totalQuantity === 0}
                sx={{
                  "& .MuiBadge-badge": {
                    right: -3,
                    top: 3,
                    border: "2px solid white",
                    padding: "0 4px",
                    fontSize: "0.7rem",
                  },
                }}
              >
                <ShoppingCart size={18} />
              </Badge>
              <Box component="span" sx={{ ml: 1 }}>
                Cart
              </Box>
            </Button>

            <Button
              component={RouterLink}
              to="/orders"
              startIcon={<History size={18} />}
              color={isActive("/orders") ? "primary" : "inherit"}
              sx={{
                fontWeight: isActive("/orders") ? 600 : 500,
                borderRadius: 2,
                bgcolor: isActive("/orders")
                  ? "rgba(253, 82, 96, 0.12)"
                  : "transparent",
                textTransform: "none",
              }}
            >
              Orders
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        component="main"
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 3 }, flex: 1 }}
      >
        <Outlet />
      </Container>

      {/* AI Modal */}
      <AiChatModal open={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </Box>
  );
}
