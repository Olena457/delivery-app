
import { Button } from "@mui/material";
import { Send } from "lucide-react";

export function TelegramBotButton() {
  const BOT_URL = "https://t.me/olena_food_delivery_service_bot";

  return (
    <Button
      component="a"
      href={BOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      startIcon={<Send size={20} />}
      sx={{
        fontWeight: 600,
        borderRadius: 2,
        background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)",
        color: "white",
        px: 2,
        textTransform: "none",
        boxShadow: "0 2px 4px rgba(253, 82, 96, 0.2)",
        "&:hover": {
          background: "linear-gradient(90deg, #FF5F6D 0%, #FFC371 100%)",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 8px rgba(253, 82, 96, 0.3)",
        },
        transition: "all 0.2s ease-in-out",
      }}
    >
      Bot
    </Button>
  );
}