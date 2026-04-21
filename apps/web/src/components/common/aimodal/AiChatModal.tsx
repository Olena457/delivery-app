import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  CircularProgress,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Bot, X, Send, CircleX, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import FadeTransition from "../../transitions/FadeTransition";
import { useAskAiMutation } from "../../../store/api/shopApi";

interface AiChatModalProps {
  open: boolean;
  onClose: () => void;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({ open, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [askAi, { isLoading }] = useAskAiMutation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    try {
      const response = await askAi({ question: userText }).unwrap();
      setMessages((prev) => [...prev, { role: "ai", text: response.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Connection error. Please try again later! 🌶️" },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{ transition: FadeTransition }}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      sx={{ "& .MuiDialog-paper": { borderRadius: 3, height: "80vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Bot size={24} color="#fd5260" />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fd5260" }}>
            Foodie AI Assistant
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {messages.length > 0 && (
            <Tooltip title="Clear chat">
              <IconButton
                onClick={handleClearChat}
                size="small"
                sx={{ color: "text.secondary" }}
              >
                <Trash2 size={18} />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          bgcolor: "#f8f9fa",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          ref={scrollRef}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 1,
          }}
        >
          {messages.length === 0 && (
            <Typography
              variant="body2"
              color="textPrimary"
              textAlign="center"
              fontSize={20}
              sx={{ mt: 4, px: 2 }}
            >
              Hi there! 👋Curious about our menu? Try asking about new dishes,
              sugar-free options, promos, vegan 🌽, or something spicy 🌶️!"
            </Typography>
          )}
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: msg.role === "user" ? "#fd5260" : "white",
                  color: msg.role === "user" ? "white" : "text.primary",
                  boxShadow: 1,
                  "& p": { m: 0 },
                }}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </Paper>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: "white", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          slotProps={{
            input: {
              endAdornment: input && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setInput("")}
                    sx={{ p: 0.5 }}
                  >
                    <CircleX size={16} color="#9e9e9e" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 3 },
            },
            htmlInput: { maxLength: 200 },
          }}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          variant="contained"
          sx={{
            minWidth: 52,
            height: 40,
            borderRadius: 3,
            background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)",
            color: "white",
            "&.Mui-disabled": { background: "#ebedee" },
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
