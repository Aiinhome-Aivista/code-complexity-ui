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
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/" || pathname === "/home";

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const logoLink = isAuthenticated ? "/dashboard" : "/home";

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

  const handleLogout = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("token");
    localStorage.clear();
    document.cookie =
      "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    logout();
    router.push("/");
  };

  return (
    <>
      <div className="h-full border-b border-neutral-200 flex justify-between items-center px-4 bg-[#f3f4f6] backdrop-blur-sm transition-colors duration-300">
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
                  <KeyboardArrowRight sx={{ fontSize: 16 }} className="text-neutral-400" />
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
                {pathname.split("/").filter(Boolean).map((segment, index, array) => {
                  if (segment.toLowerCase() === "dashboard") return null;

                  const path = `/${array.slice(0, index + 1).join("/")}`;
                  const isLast = index === array.length - 1;
                  
                  // Format segment name
                  const segmentName = segment
                    .split("-")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  return (
                    <div key={path} className="flex items-center gap-1">
                      <KeyboardArrowRight sx={{ fontSize: 16 }} className="text-neutral-400" />
                      {isLast ? (
                        <span className="text-neutral-500 font-semibold cursor-default">
                          {segmentName}
                        </span>
                      ) : (
                        <Link 
                          href={path}
                          className="hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {segmentName}
                        </Link>
                      )}
                    </div>
                  );
                })}
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

                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-gray-200 rounded-xl shadow-xl shadow-gray-300/70 border border-gray-300 py-1.5 z-500 origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                      <div className="px-2 py-2 border-b border-neutral-100 mb-1">
                        <div className="text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                          Plan
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700 font-medium bg-amber-50/60 px-2 py-1.5 rounded-lg">
                          <PremiumIcon
                            sx={{ fontSize: 16 }}
                            className="text-amber-500"
                          />
                          Free Tier
                        </div>
                      </div>
                      <div className="px-2">
                        <div
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50/50 cursor-pointer transition-colors group"
                        >
                          <LogoutIcon
                            sx={{ fontSize: 18 }}
                            className="group-hover:text-red-500 transition-colors"
                          />
                          Sign out
                        </div>
                      </div>
                    </div>
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
      </div>
    </>
  );
}

export default Header;
