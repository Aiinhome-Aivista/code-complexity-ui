"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useUIStore } from "@/store/uiStore";

export function Breadcrumbs() {
    const pathname = usePathname();
    const { activeProjectName } = useUIStore();

    const isAuthenticated = pathname !== "/home" && pathname !== "/" && pathname !== "/login" && pathname !== "/register";

    if (!isAuthenticated || pathname === "/home" || pathname === "/") return null;

    return (
        <div className="hidden md:flex items-center gap-1 ml-2 text-sm font-medium text-neutral-500 animate-fade-in">
            {/* Always show Dashboard as root */}
            <div className="flex items-center gap-1">
                <KeyboardArrowRight sx={{ fontSize: 16 }} className="text-neutral-400" />
                {pathname === "/dashboard" ? (
                    <span className="text-neutral-800 font-semibold cursor-default">Dashboard</span>
                ) : (
                    <Link href="/dashboard" className="hover:text-indigo-600 transition-colors cursor-pointer">
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

                    const segmentName = segment
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ");

                    return (
                        <div key={path} className="flex items-center gap-1">
                            <KeyboardArrowRight sx={{ fontSize: 16 }} className="text-neutral-400" />
                            {isLast && !activeProjectName ? (
                                <span className="text-neutral-500 font-semibold cursor-default">{segmentName}</span>
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
                    <KeyboardArrowRight sx={{ fontSize: 16 }} className="text-neutral-400" />
                    <span className="text-neutral-500 font-semibold cursor-default">{activeProjectName}</span>
                </div>
            )}
        </div>
    );
}

export default Breadcrumbs;
