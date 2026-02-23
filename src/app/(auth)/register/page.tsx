"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowForward } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authService } from "@/services/auth_apiservice";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning",
  });

  const showToast = (
    message: string,
    severity: "success" | "error" | "warning"
  ) => setToast({ open: true, message, severity });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "warning");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register({ name, email, password });

      if (response && response.isSuccess) {
        showToast(
          response.message || "Registration successful! Please login.",
          "success"
        );
        // Delay redirect so user can read the message
        setTimeout(() => router.push("/login"), 2500);
      } else {
        showToast(response?.message || "Registration failed", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast(
        (error as Error).message || "An error occurred during registration",
        "error"
      );
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
          Create an account
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Start optimizing your code quality today
        </p>
      </div>

      <Card className="p-6 bg-gray-200 dark:bg-neutral-900 border-gray-300 dark:border-neutral-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-800">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="bg-gray-300 dark:bg-neutral-950 text-gray-800 border-gray-400 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800">Email</Label>
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
            <Label htmlFor="password" className="text-gray-800">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-gray-300 dark:bg-neutral-950 text-gray-800 border-gray-400 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-800">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              className="bg-gray-300 dark:bg-neutral-950 text-gray-800 border-gray-400 focus:border-indigo-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
            {!isLoading && (
              <ArrowForward sx={{ fontSize: 18 }} className="ml-2" />
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Sign in
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
