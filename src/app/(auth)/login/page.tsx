"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitHub, Google, ArrowForward } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authService } from "@/services/auth_apiservice";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await authService.login({ email, password });

      if (response && response.isSuccess) {
        localStorage.setItem("userdata", JSON.stringify(response.data));
        setToast({
          open: true,
          message: response.message || "Login successful",
          severity: "success",
        });
        router.push("/dashboard");
      } else {
        setToast({
          open: true,
          message: response?.message || "Login failed",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setToast({
        open: true,
        message: (error as Error).message || "An error occurred during login",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-700 text-white font-bold text-xl shadow-lg shadow-indigo-900/10 mb-4 animate-float">
          CQ
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <Card className="p-6 bg-gray-200 dark:bg-neutral-900 border-gray-300 dark:border-neutral-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className=" text-gray-800">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="bg-gray-300 dark:bg-neutral-950 text-gray-800 border-gray-400 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-800">
                Password
              </Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-gray-300 dark:bg-neutral-950 text-gray-800 border-gray-400 focus:border-indigo-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && (
              <ArrowForward sx={{ fontSize: 18 }} className="ml-2" />
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </Card>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
