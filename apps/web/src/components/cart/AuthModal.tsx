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
} from "@mui/material";
import FadeTransition from "../transitions/FadeTransition";
import { Mail, Key, X } from "lucide-react"; 
import { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
  onSendCode: () => void;
  onVerifyCode: (code: string) => void;
  isCodeSent: boolean;
  isLoading: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  email,
  setEmail,
  onSendCode,
  onVerifyCode,
  isCodeSent,
  isLoading,
}) => {
  const [code, setCode] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{ transition: FadeTransition }}
      maxWidth="xs"
      sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isCodeSent ? (
            <Key size={20} color="#FF5F6D" />
          ) : (
            <Mail size={20} color="#FF5F6D" />
          )}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isCodeSent ? "Enter Verification Code" : "Order History Login"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ py: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {!isCodeSent ? (
            <>
              <Typography variant="body2" color="text.secondary">
                Please enter the email you used for your orders. We will send
                you a 6-digit verification code.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                A code has been sent to <b>{email}</b>. It is valid for 10
                minutes.
              </Typography>
              <TextField
                fullWidth
                label="6-Digit Code"
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: "center",
                    letterSpacing: "0.5rem",
                    fontSize: "1.2rem",
                  },
                }}
              />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => (isCodeSent ? onVerifyCode(code) : onSendCode())}
          variant="contained"
          disabled={
            isLoading ||
            (!isCodeSent && !email) ||
            (isCodeSent && code.length < 6)
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)",
            color: "white",
          }}
        >
          {isLoading
            ? "Processing..."
            : isCodeSent
              ? "Verify Code"
              : "Send Code"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
