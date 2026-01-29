"use client";

import Link from "next/link";
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  Person as PersonIcon,
  WorkspacePremium as PremiumIcon,
} from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { isUserMenuOpen, closeUserMenu } = useUIStore();
  const { user, logout } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeUserMenu();
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, closeUserMenu]);

  const handleLogout = () => {
    // Explicitly remove items used by AuthProvider
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
    localStorage.clear();
    // Clear cookie if it exists (for middleware compatibility)
    document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    // AuthProvider syncs this change to local storage and redirects
    logout();
    closeUserMenu();
    // Router push is handled by AuthProvider typically, but explicit here is fine too
    router.push("/");
  };

  if (!isUserMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      onMouseLeave={closeUserMenu}
      className="fixed top-3 right-16 w-60 rounded-xl bg-gray-200/80 backdrop-blur-md border border-gray-700 shadow-lg shadow-neutral-200/50 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="p-1">
        {/* User Profile Section */}
        <div className="px-3 py-2.5 mb-1">
          <div className="flex items-center gap-2 mb-1">
            <PersonIcon sx={{ fontSize: 16 }} className="text-neutral-500" />
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {user?.name || "Guest User"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PremiumIcon sx={{ fontSize: 16 }} className="text-amber-500" />
            <p className="text-xs text-neutral-500">
              {user ? "Free Tier" : "Not logged in"}
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-300/50 my-1 mx-2" />

        {user ? (
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50/50 hover:text-red-700 transition-colors cursor-pointer"
          >
            <LogoutIcon sx={{ fontSize: 18 }} />
            <span>Logout</span>
          </div>
        ) : (
          <Link href="/login" onClick={closeUserMenu}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-neutral-700 hover:bg-white/50 hover:text-neutral-900 transition-colors cursor-pointer">
              <LoginIcon sx={{ fontSize: 18 }} className="text-neutral-500" />
              <span>Login</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
