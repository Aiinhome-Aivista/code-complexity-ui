import type { Metadata } from "next";
import Header from "@/components/layouts/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { PaymentModalWrapper } from "@/components/providers/PaymentModalWrapper";
import { GlobalSnackbar } from "@/components/providers/GlobalSnackbar";
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
      <body className="antialiased h-screen overflow-hidden bg-neutral-100 text-neutral-900 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <header className="fixed top-0 left-0 right-0 h-16 z-[5000]">
              <Header />
            </header>
            <div className="h-full overflow-auto custom-scrollbar pt-16">
              {children}
            </div>
            <PaymentModalWrapper />
            <GlobalSnackbar />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function GlobalPaymentModalWrapper() {
  const { isPaymentModalOpen, closePaymentModal } = useAuthStore();

  return (
    <PaymentModal
      open={isPaymentModalOpen}
      onClose={closePaymentModal}
      onSuccess={(method) => {
        closePaymentModal();
        alert(`Payment successful via ${method.toUpperCase()}! You are now a Pro.`);
      }}
    />
  );
}
