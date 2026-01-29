"use client";

import * as React from "react";
import { Check as CheckIcon } from "@mui/icons-material";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    data-state={checked ? "checked" : "unchecked"}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-neutral-500 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
      "bg-neutral-800",
      "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white",
      className
    )}
    onClick={() => onCheckedChange?.(!checked)}
    ref={ref}
    {...props}
  >
    <span
      className={cn("flex items-center justify-center text-current")}
      style={{ visibility: checked ? "visible" : "hidden" }}
    >
      <CheckIcon style={{ fontSize: 14 }} className="stroke-current" />
    </span>
  </button>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
