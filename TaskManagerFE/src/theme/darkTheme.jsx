import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0c071b",
    },
    text: {
      primary: "#fff",
    },
    primary: {
      main: "rgba(215,106,255,0.507)",
    },
  },
});