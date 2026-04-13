import { Box, CircularProgress } from "@mui/material";

export const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      width: "100%",
    }}
  >
    <CircularProgress color="inherit" size={60} thickness={4} />
  </Box>
);
