"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let isRedirecting = false;
    try {
      const userData = localStorage.getItem("userdata");
      const isPublicPath =
        pathname === "/" ||
        pathname === "/home" ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/about" ||
        pathname === "/blog" ||
        pathname === "/help-center" ||
        pathname === "/privacy-policy";

      if (userData) {
        const parsedUser = JSON.parse(userData);
        const token = localStorage.getItem("token") || "mock-token";
        login(parsedUser, token);

        if (isPublicPath) {
          router.push("/dashboard");
          isRedirecting = true;
        }
      } else {
        logout();

        if (!isPublicPath) {
          router.push("/");
          isRedirecting = true;
        }
      }
    } catch (error) {
      console.error("Failed to parse user data", error);
      logout();
    } finally {
      if (!isRedirecting) {
        setIsLoading(false);
      }
    }
  }, [login, logout, pathname, router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
