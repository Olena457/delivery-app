// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: { main: "#b90e44" },
//     secondary: { main: "#b415d0c8" },
//   },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 900,
//       lg: 1200,
//       xl: 1520,
//     },
//   },

// });

// export default theme;
// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: { main: "#FF5F6D" },
//     secondary: { main: "#b415d0c8" },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         containedPrimary: {
//           background: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)",
//           border: 0,
//           color: "white",
//         },
//       },
//     },
//     MuiSlider: {
//       styleOverrides: {
//         track: {
//           background: "linear-gradient(90deg, #FF5F6D 0%, #FFC371 100%)",
//           border: "none",
//         },
//         thumb: {
//           backgroundColor: "#FF5F6D",
//         },
//       },
//     },
//   },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 900,
//       lg: 1200,
//       xl: 1520,
//     },
//   },
// });

// export default theme;
import { createTheme } from "@mui/material/styles";

const mainGradient = "linear-gradient(135deg, #FF0844 0%, #FFB199 100%)";
const hoverGradient = "linear-gradient(135deg, #FFB199 0%, #FF0844 100%)";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FF0844" },
    secondary: { main: "#b415d0c8" },
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          background: mainGradient,
          border: 0,
          color: "white",
          transition: "0.3s ease",
          "&:hover": {
            background: hoverGradient,
            boxShadow: "0px 4px 15px rgba(255, 8, 68, 0.4)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          transition: "0.3s all",
        },
        colorPrimary: {
          background: mainGradient,
          color: "white",
          border: "none",
          "&:hover": {
            background: hoverGradient,
          },
        },
        outlinedPrimary: {
          borderColor: "#FF0844",
          "&:hover": {
            backgroundColor: "rgba(255, 8, 68, 0.04)",
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        track: {
          background: mainGradient,
          border: "none",
        },
        thumb: {
          backgroundColor: "#FF0844",
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0px 0px 0px 8px rgba(255, 8, 68, 0.16)",
          },
        },
      },
    },
  },
});

export default theme;
