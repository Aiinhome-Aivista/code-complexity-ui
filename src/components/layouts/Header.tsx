"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Logout as LogoutIcon,
  Login as LoginIcon,
  WorkspacePremium as PremiumIcon,
  Settings as SettingsIcon,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { Snackbar, Alert, Box } from "@mui/material"; // Added Snackar, Alert, Box
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

import { createPortal } from "react-dom";

function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const {
    activeProjectName,
    setActiveProjectName,
    setProjectResults,
    setHeatmapData,
    setFileNodeData,
    setFlowData,
  } = useUIStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false); // New state for logout confirm
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/" || pathname === "/home";

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const logoLink = isAuthenticated ? "/dashboard" : "/home";

  // Clear active project name and analysis data when returning to dashboard
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveProjectName(null);
      setProjectResults(null);
      setHeatmapData(null);
      setFileNodeData(null);
      setFlowData(null);
    }
  }, [pathname, setActiveProjectName, setProjectResults, setHeatmapData, setFileNodeData, setFlowData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleCancelLogout = () => {
    setLogoutConfirmOpen(false);
  };

  const performLogout = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
    localStorage.clear();
    document.cookie =
      "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    logout();
    router.push("/");
    setLogoutConfirmOpen(false);
  };

  return (
      <div className="h-full border-b border-neutral-200 flex justify-between items-center px-4 bg-gray-200 backdrop-blur-sm transition-colors duration-300 z-500">
        <div className="flex text-neutral-900 gap-8 items-center">
          <div className="flex gap-2 items-center">
            <Link
              href={logoLink}
              className="flex gap-2 items-center cursor-pointer"
            >
              <div className="bg-indigo-700 text-white text-xl font-bold p-1.5 rounded-xl shadow-lg shadow-indigo-900/10">
                CQ
              </div>
              <h3 className="text-xl font-bold tracking-tight">CodeQuality</h3>
            </Link>

            {/* Breadcrumbs */}
            {isAuthenticated && pathname !== "/home" && pathname !== "/" && (
              <div className="hidden md:flex items-center gap-1 ml-2 text-sm font-medium text-neutral-500 animate-fade-in">
                {/* Always show Dashboard as root */}
                <div className="flex items-center gap-1">
                  <KeyboardArrowRight
                    sx={{ fontSize: 16 }}
                    className="text-neutral-400"
                  />
                  {pathname === "/dashboard" ? (
                    <span className="text-neutral-800 font-semibold cursor-default">
                      Dashboard
                    </span>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>

                {/* Map remaining segments */}
                {pathname
                  .split("/")
                  .filter(Boolean)
                  .map((segment, index, array) => {
                    if (segment.toLowerCase() === "dashboard") return null;

                    const path = `/${array.slice(0, index + 1).join("/")}`;
                    const isLast = index === array.length - 1;

                    // Format segment name
                    const segmentName = segment
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ");

                    return (
                      <div key={path} className="flex items-center gap-1">
                        <KeyboardArrowRight
                          sx={{ fontSize: 16 }}
                          className="text-neutral-400"
                        />
                        {isLast && !activeProjectName ? (
                          <span className="text-neutral-500 font-semibold cursor-default">
                            {segmentName}
                          </span>
                        ) : (
                          <Link
                            href={path}
                            className={
                              isLast && activeProjectName
                                ? "text-neutral-500 font-semibold cursor-default"
                                : "hover:text-indigo-600 transition-colors cursor-pointer"
                            }
                          >
                            {segmentName}
                          </Link>
                        )}
                      </div>
                    );
                  })}

                {/* Active Project Name Append */}
                {activeProjectName && (
                  <div className="flex items-center gap-1">
                    <KeyboardArrowRight
                      sx={{ fontSize: 16 }}
                      className="text-neutral-400"
                    />
                    <span className="text-neutral-500 font-semibold cursor-default">
                      {activeProjectName}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-8">
          {isHomePage && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-base font-semibold text-neutral-600 hover:text-indigo-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-base font-semibold text-neutral-600 hover:text-indigo-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-base font-semibold text-neutral-600 hover:text-indigo-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                About
              </Link>
            </nav>
          )}

          {!isAuthPage && (
            <div className="flex items-center relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 font-medium border border-transparent cursor-default">
                    <PersonOutlineIcon sx={{ fontSize: 18 }} />
                    <span className="text-sm">{user?.name || "User"}</span>
                  </div>

                  <div className="h-5 w-px bg-neutral-200 mx-1"></div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`cursor-pointer flex items-center gap-2 text-neutral-600 font-medium hover:text-indigo-700 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 rounded-lg px-3 ${isDropdownOpen ? "bg-indigo-50 text-indigo-700 border-indigo-100" : ""}`}
                  >
                    <SettingsIcon
                      sx={{ fontSize: 18 }}
                      className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-90" : ""}`}
                    />
                    <span className="text-sm">Options</span>
                  </Button>

                  {isDropdownOpen &&
                    mounted &&
                    createPortal(
                      <div
                        ref={dropdownRef}
                        className="fixed top-16 right-4 w-56 bg-gray-200 rounded-xl shadow-xl shadow-gray-300/70 border border-gray-300 py-1.5 z-[9999] origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
                      >
                        <div className="px-2 py-2 border-b border-neutral-100 mb-1">
                          <div className="text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                            Plan
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-700 font-medium hover:bg-amber-50/50 px-2 py-1.5 rounded-lg cursor-default">
                            <PremiumIcon
                              sx={{ fontSize: 16 }}
                              className="text-amber-500"
                            />
                            Free Tier
                          </div>
                        </div>
                        <div className="px-2">
                          <div
                            onClick={handleLogoutClick}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50/40 cursor-pointer transition-colors group"
                          >
                            <LogoutIcon
                              sx={{ fontSize: 18 }}
                              className="group-hover:text-red-500 transition-colors"
                            />
                            Sign out
                          </div>
                        </div>
                      </div>,
                      document.body,
                    )}
                </>
              ) : (
                <Link href="/login">
                  <Button
                    className="bg-indigo-700 hover:bg-indigo-800 text-white shadow-lg shadow-indigo-900/20 gap-2 transition-all hover:scale-105"
                    size="sm"
                  >
                    <LoginIcon sx={{ fontSize: 18 }} />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Logout Confirmation Snackbar */}
        <Snackbar
          open={logoutConfirmOpen}
          onClose={handleCancelLogout}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="warning"
            variant="filled"
            sx={{
              width: "100%",
              borderRadius: 2,
              alignItems: "center",
              "& .MuiAlert-message": {
                display: "flex",
                alignItems: "center",
                gap: 2,
              },
            }}
            action={
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelLogout}
                  className="text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={performLogout}
                  className="bg-red-700 hover:bg-red-800 text-white border-0"
                >
                  Logout
                </Button>
              </Box>
            }
          >
            Are you sure you want to sign out?
          </Alert>
        </Snackbar>
      </div>
  );
}

export default Header;
