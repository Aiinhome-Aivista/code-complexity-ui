"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Terminal as TerminalIcon } from "@mui/icons-material";
import { Button } from "@/components/ui/Button";
import { TerminalPanel } from "@/features/terminal";

export function TerminalToggle() {
    // isAlive = panel is mounted (state preserved). isVisible = panel is shown.
    const [isAlive, setIsAlive] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-close terminal when exiting the analysis page
    useEffect(() => {
        if (pathname !== "/dashboard/analysis") {
            setIsVisible(false);
            setIsAlive(false);
        }
    }, [pathname]);

    const handleToggle = () => {
        if (!isAlive) {
            setIsAlive(true);
            setIsVisible(true);
        } else {
            setIsVisible(!isVisible);
        }
    };

    const handleMinimize = () => {
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
        setIsAlive(false);
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className={`flex items-center gap-2 text-neutral-600 font-medium hover:text-indigo-700 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 rounded-lg px-3 mr-1 cursor-pointer ${isVisible ? "bg-indigo-50 text-indigo-700 border-indigo-100" : ""}`}
            >
                <TerminalIcon sx={{ fontSize: 20 }} />
                <span className="text-sm hidden md:inline">Terminal</span>
            </Button>

            {isAlive && mounted && createPortal(
                <div style={{ display: isVisible ? "flex" : "none", height: "320px" }} className="fixed bottom-0 left-0 right-0 z-[9998] flex-col">
                    <TerminalPanel onMinimize={handleMinimize} onClose={handleClose} />
                </div>,
                document.body
            )}
        </>
    );
}

export default TerminalToggle;
