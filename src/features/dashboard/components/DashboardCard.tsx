import { Card } from "@/components/ui/Card";
import { ArrowForward } from "@mui/icons-material";
import Link from "next/link";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  disabled?: boolean;
}

export function DashboardCard({
  title,
  description,
  icon,
  href,
  disabled = false,
}: DashboardCardProps) {
  const Content = (
    <Card className={`p-6 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xl transition-all duration-300 ${disabled ? "opacity-60 cursor-not-allowed" : "hover:border-blue-500/50 hover:shadow-blue-500/10"}`}>
      <div className="flex flex-col h-full justify-between gap-4">
        <div>
          <div className="bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className={`flex items-center text-sm font-semibold ${disabled ? "text-neutral-400" : "text-blue-600 dark:text-blue-400"}`}>
          {disabled ? "Coming Soon" : "Get Started"}
          {!disabled && <ArrowForward sx={{ fontSize: 16 }} className="ml-2 transition-transform group-hover:translate-x-1" />}
        </div>
      </div>
    </Card>
  );

  if (disabled) {
    return Content;
  }

  return (
    <Link href={href} className="block group">
      {Content}
    </Link>
  );
}
