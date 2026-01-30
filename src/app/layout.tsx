import type { Metadata } from "next";
import Header from "@/components/layouts/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeQuality",
  description: "Code complexity & heatmap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased h-screen flex flex-col overflow-hidden bg-neutral-100 text-neutral-900 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <header className="h-16 flex-shrink-0">
              <Header />
            </header>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
