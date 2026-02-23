"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Login as LoginIcon } from "@mui/icons-material";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

import { TerminalToggle } from "@/components/layouts/TerminalToggle";
import { GitDropdown } from "@/components/layouts/GitDropdown";
import { OptionsDropdown } from "@/components/layouts/OptionsDropdown";
import { Breadcrumbs } from "@/components/layouts/Breadcrumbs";

function Header() {
  const { isAuthenticated } = useAuthStore();
  const {
    setActiveProjectName,
    setProjectResults,
    setHeatmapData,
    setFileNodeData,
    setFlowData,
  } = useUIStore();
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/home";
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAnalysisPage = [
    "/code-view",
    "/code-health",
    "/api-analysis",
    "/visualization",
    "/heatmap",
    "/relationship",
    "/flow",
    "/insights",
    "/performance",
    "/downloads"
  ].some(path => pathname?.includes(path));
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

  return (
    <div className="h-full border-b border-neutral-200 flex justify-between shadow-md items-center px-8 bg-gray-200 backdrop-blur-sm transition-colors duration-300 z-[5000]">
      <div className="flex text-neutral-900 gap-8 items-center">
        <div className="flex gap-2 items-center">
          <Link href={logoLink} className="flex gap-2 items-center cursor-pointer">
            <div className="bg-indigo-700 text-white text-xl font-bold p-1.5 rounded-xl shadow-lg shadow-indigo-900/10">
              CQ
            </div>
            <h3 className="text-xl font-bold tracking-tight">CodeQuality</h3>
          </Link>

          {/* Breadcrumbs */}
          {isAuthenticated && <Breadcrumbs />}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {isHomePage && (
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-base font-semibold text-neutral-600 hover:text-indigo-700 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }}>
              Features
            </Link>
            <Link href="#pricing" className="text-base font-semibold text-neutral-600 hover:text-indigo-700 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}>
              Pricing
            </Link>
            <Link href="#about" className="text-base font-semibold text-neutral-600 hover:text-indigo-700 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}>
              About
            </Link>
          </nav>
        )}

        {!isAuthPage && (
          <div className="flex items-center relative">
            {isAuthenticated ? (
              <>

                {isAnalysisPage && (
                  <div className="flex items-center">
                    <GitDropdown />
                    <TerminalToggle />
                  </div>
                )}
                {(isAnalysisPage || pathname === "/dashboard") && (
                  <div className="flex items-center mr-2">
                    <OptionsDropdown />
                    {isAnalysisPage && <div className="h-5 w-px bg-neutral-200 mx-1"></div>}
                  </div>
                )}
              </>
            ) : (
              <Link href="/register">
                <Button
                  className="bg-indigo-700 hover:bg-indigo-800 text-white shadow-lg shadow-indigo-900/20 gap-2 transition-all hover:scale-105"
                  size="sm"
                >
                  <LoginIcon sx={{ fontSize: 18 }} />
                  Signup For Free
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
