"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { CloudUpload } from "@mui/icons-material";
import { UploadModal } from "@/components/upload/UploadModal";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/store/uiStore";

function Header() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toggleUserMenu } = useUIStore();
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/home";

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      <div className="h-full border-b border-neutral-200 flex justify-between items-center px-4 bg-[#f3f4f6] backdrop-blur-sm transition-colors duration-300">
        <div className="flex text-neutral-900 gap-8 items-center">
          <div className="flex gap-2 items-center">
            <div className="bg-indigo-700 text-white text-xl font-bold p-1.5 rounded-xl shadow-lg shadow-indigo-900/10">
              CQ
            </div>
            <h3 className="text-xl font-bold tracking-tight">CodeQuality</h3>
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
          <div className="flex items-center gap-4">
            {/* <Button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-indigo-700 hover:bg-indigo-800 text-white gap-2 shadow-lg shadow-indigo-900/20 transition-all hover:scale-105"
            size="sm"
          >
            <CloudUpload sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Upload Project</span>
          </Button> */}

            {!isAuthPage && (
              <Button
                variant="outline"
                size="icon"
                onMouseEnter={toggleUserMenu}
                className="rounded-full w-9 h-9 border-neutral-200 bg-white hover:bg-indigo-50 hover:text-indigo-700 transition-all hover:scale-105 group cursor-pointer"
              >
                <PersonOutlineIcon
                  sx={{ fontSize: 20 }}
                  className="text-neutral-600 group-hover:text-indigo-700"
                />
              </Button>
            )}
          </div>
        </div>
      </div>
      <UploadModal open={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </>
  );
}

export default Header;
