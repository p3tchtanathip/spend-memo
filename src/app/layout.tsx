import "./globals.css";
import theme from "@/utils/theme";
import { ThemeProvider } from "@mui/material/styles";
import { TanstackProvider } from "@/providers/tanstack.provider";
import SessionProvider from "@/providers/session.provider"; 
import { getServerSession } from "next-auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <SessionProvider session={session}>
            <TanstackProvider>
              {children}
            </TanstackProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
