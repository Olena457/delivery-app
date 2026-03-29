import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { Trash2, X } from "lucide-react";

interface ConfirmClearCartModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} timeout={{ enter: 500, exit: 400 }} />;
});

export const ConfirmClearCartModal: React.FC<ConfirmClearCartModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{
        transition: Transition,
      }}
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
          <Trash2 size={20} color="#d32f2f" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Clear Cart
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ py: 1 }}>
          Are you sure you want to clear your shopping cart? This action cannot
          be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "2",
            px: 3,
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "#de4848",
            },
          }}
        >
          Yes, Clear Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};
