"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Close as CloseIcon } from "@mui/icons-material";
import { cn } from "@/lib/utils";

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog provider");
  }
  return context;
}

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  children,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = controlledOnOpenChange || setUncontrolledOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { onOpenChange } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props.onClick?.(e);
        onOpenChange(true);
      },
      ...props,
    });
  }

  return (
    <button className={className} onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { open, onOpenChange } = useDialog();

  if (!open) return null;

  return (
    <DialogPortal>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        onClick={() => onOpenChange(false)} // Close on background click
        {...props}
      />
    </DialogPortal>
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, onOpenChange } = useDialog();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsAnimatingOut(false);
    } else if (isVisible) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimatingOut(false);
      }, 200); // 200ms duration
      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);

  // Handle ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onOpenChange]);

  if (!isVisible && !open) return null;

  return (
    <DialogPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center pt-16 pb-6 overflow-y-auto">
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/30 backdrop-blur-sm",
            isAnimatingOut ? "animate-out-fade" : "animate-in-fade",
          )}
          onClick={() => onOpenChange(false)}
        />
        {/* Content */}
        <div
          className={cn(
            "relative z-50 grid w-full max-w-lg gap-4 border border-neutral-800 bg-neutral-950 p-6 shadow-lg sm:rounded-lg md:w-full max-h-[calc(100vh-5rem)] overflow-y-auto",
            isAnimatingOut ? "animate-out-zoom" : "animate-in-zoom",
            className,
          )}
          {...props}
        >
          {children}
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            <CloseIcon className="h-4 w-4 text-red-400" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-neutral-100",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-neutral-400", className)} {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal, // Optional export
  DialogOverlay, // Optional export if we decouple
};
