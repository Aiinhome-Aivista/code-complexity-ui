"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitHub, Google, ArrowForward, Refresh, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authService } from "@/services/auth_apiservice";
import { useUIStore } from "@/store/uiStore";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showSnackbar } = useUIStore();

  const fetchCaptcha = async () => {
    try {
      const response = await authService.getCaptcha();
      if (response && response.isSuccess) {
        setCaptchaQuestion(response.data.question);
        setCaptchaToken(response.data.captcha_token);
      } else {
        showSnackbar("Failed to load captcha", "error");
      }
    } catch (error) {
      console.error("Captcha error:", error);
      showSnackbar("Failed to load captcha", "error");
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const captcha = formData.get("captcha") as string;

    try {
      const response = await authService.login({
        email,
        password,
        captcha,
        captcha_token: captchaToken
      });

      if (response && response.isSuccess) {
        localStorage.setItem("userdata", JSON.stringify(response.data));
        showSnackbar(response.message || "Login successful", "success");
        router.push("/dashboard");
      } else {
        showSnackbar(response?.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showSnackbar((error as Error).message || "An error occurred during login", "error");
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="bg-gray-300 dark:bg-neutral-950 text-gray-800 border-gray-400 focus:border-indigo-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="captcha" className="text-gray-800">
                Captcha
              </Label>
              <Button
                type="button"
                onClick={fetchCaptcha}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30"
                title="Refresh Captcha"
              >
                <Refresh sx={{ fontSize: 18 }} className="mr-1" />
                <span className="text-xs font-medium text-black">Refresh</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center justify-center bg-gray-300 dark:bg-neutral-950 text-gray-800 border border-gray-400 rounded-md px-4 h-9 min-w-[120px] font-mono text-lg tracking-wider">
                {captchaQuestion || "---"}
              </div>
              <Input
                id="captcha"
                name="captcha"
                type="number"
                min="0"
                placeholder="Enter answer"
                required
                className="flex-1 h-9 bg-gray-300 dark:bg-neutral-950 text-gray-800 border-gray-400 focus:border-indigo-500"
              />
            </div>
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
    </div>
  );
}
