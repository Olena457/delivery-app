import { Button } from "@mui/material";
import { Bot } from "lucide-react";

interface AiChatButtonProps {
  onClick: () => void;
}

export function AiChatButton({ onClick }: AiChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      startIcon={<Bot size={21} />}
      sx={{
        fontWeight: 600,
        borderRadius: 2,
        background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)",
        color: "white",
        px: 2,
        textTransform: "none",
        boxShadow: "0 2px 4px rgba(253, 82, 96, 0.2)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          opacity: 0.9,
          transform: "translateY(-1px)",
          background: "linear-gradient(90deg, #FF5F6D 0%, #FFC371 100%)",

          boxShadow: "0 4px 8px rgba(253, 82, 96, 0.3)",
        },
      }}
    >
      AI chat
    </Button>
  );
}
