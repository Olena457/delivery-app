
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FF5F6D" },
    secondary: { main: "#e16bf6c8" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)",
          border: 0,
          color: "white",
          "&:hover": {
            background: "linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%) ",
          color: "white",
          border: "none",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        track: {
          background: "linear-gradient(90deg, #FF5F6D 0%, #FFC371 100%)",
          border: "none",
        },
        thumb: {
          backgroundColor: "#FF5F6D",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1520,
    },
  },
});

export default theme;

