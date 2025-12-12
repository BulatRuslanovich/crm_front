import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FarmCRM - Your Ultimate Farm Management Solution",
  description: "CRM system by getcrm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Welcome to FarmCRM!");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} antialiased font-poppins font-normal`}
      >
        <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}

              <Toaster richColors />
            </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
