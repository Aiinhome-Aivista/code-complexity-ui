"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Dashboard,
  Analytics,
  Code,
  Hub,
  Speed,
  Description,
  AccountTree,
  Lightbulb,
  Polyline,
  ViewQuilt,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { navItems } from "@/config/nav-items";
import { cn } from "@/lib/utils";

const iconMap: { [key: string]: React.ElementType } = {
  Dashboard,
  Analytics,
  Code,
  Hub,
  Speed,
  Description,
  AccountTree,
  Lightbulb,
  Polyline,
  ViewQuilt,
};

export default function Navbar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2 bg-gray-200 border-b border-neutral-200 transition-colors duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 text-neutral-500 hover:bg-gray-200/70 hover:text-neutral-900 hidden sm:flex cursor-pointer"
        onClick={() => scroll("left")}
      >
        <ChevronLeft />
      </Button>

      <nav
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto scrollbar-hide no-scrollbar scroll-smooth px-2 w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== "/code-health" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0",
                isActive
                  ? "bg-indigo-100 dark:bg-neutral-800 text-indigo-700 dark:text-white"
                  : "text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800/60",
              )}
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon sx={{ fontSize: 18 }} />}
                <span className="font-semibold">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 text-neutral-500 hover:bg-gray-200/70 hover:text-neutral-900 hidden sm:flex cursor-pointer"
        onClick={() => scroll("right")}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
