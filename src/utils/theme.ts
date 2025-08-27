"use client";
import { createTheme } from "@mui/material/styles";
import { IBM_Plex_Sans_Thai } from "next/font/google";

const ibmPlex = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const theme = createTheme({
  palette: { mode: 'light' },
  typography: {
    fontFamily: ibmPlex.style.fontFamily
  },
});

export default theme;