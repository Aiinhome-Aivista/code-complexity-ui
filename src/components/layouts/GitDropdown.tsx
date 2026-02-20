"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    GitHub as GitHubIcon,
    CloudUpload as CloudUploadIcon,
    CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { commonService } from "@/services/common_apiservice";

export function GitDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCommitInput, setShowCommitInput] = useState(false);
    const [showPullConfirmation, setShowPullConfirmation] = useState(false);
    const [commitMessage, setCommitMessage] = useState("");
    const [branchName, setBranchName] = useState("main");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
        open: false,
        message: "",
        severity: "info",
    });
    const buttonRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { activeSessionId } = useUIStore();
    const { user } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setShowCommitInput(false);
                setShowPullConfirmation(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const getUserId = (): number | string | undefined => {
        let userId = user?.id;
        if (!userId) {
            try {
                userId = JSON.parse(localStorage.getItem("userdata") || "{}").id;
            } catch { /* ignore */ }
        }
        return userId;
    };

    const handleGitPull = async () => {
        const userId = getUserId();
        if (!userId || !activeSessionId) {
            setSnackbar({ open: true, message: "User or Session not found.", severity: "error" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await commonService.gitPull({
                user_id: userId,
                session_id: activeSessionId,
                branch: branchName,
            });
            const apiMessage = response?.message?.message || "Git Pull initiated successfully.";
            const apiStatus = response?.message?.status === "success" ? "success" : "info";
            setSnackbar({ open: true, message: apiMessage, severity: apiStatus });
            setIsOpen(false);
            setShowPullConfirmation(false);
        } catch (error) {
            console.error("Git Pull failed:", error);
            setSnackbar({ open: true, message: "Failed to initiate Git Pull.", severity: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGitPush = async () => {
        const userId = getUserId();
        if (!userId || !activeSessionId) {
            setSnackbar({ open: true, message: "User or Session not found.", severity: "error" });
            return;
        }
        if (!commitMessage.trim()) return;

        setIsLoading(true);
        try {
            const response = await commonService.gitPush({
                user_id: userId,
                session_id: activeSessionId,
                message: commitMessage,
                branch: branchName,
            });
            const apiMessage = response?.message?.message || "Git Push initiated successfully.";
            const apiStatus = response?.message?.status === "success" ? "success" : "info";
            setSnackbar({ open: true, message: apiMessage, severity: apiStatus });
            setCommitMessage("");
            setIsOpen(false);
            setShowCommitInput(false);
        } catch (error) {
            console.error("Git Push failed:", error);
            setSnackbar({ open: true, message: "Failed to initiate Git Push.", severity: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={buttonRef}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setShowCommitInput(false);
                    setShowPullConfirmation(false);
                }}
                className={`flex items-center gap-2 text-neutral-600 font-medium hover:text-indigo-700 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 rounded-lg px-3 cursor-pointer ${isOpen ? "bg-indigo-50 text-indigo-700 border-indigo-100" : ""}`}
            >
                <GitHubIcon sx={{ fontSize: 20 }} />
                <span className="text-sm hidden md:inline">Git</span>
            </Button>

            {isOpen && mounted && createPortal(
                <div
                    ref={dropdownRef}
                    className={`fixed bg-gray-200 rounded-xl shadow-xl shadow-gray-300/70 border border-gray-300 py-2 z-[9999] origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 transition-all ${(showCommitInput || showPullConfirmation) ? "w-80" : "w-64"}`}
                    style={{
                        top: buttonRef.current?.getBoundingClientRect().bottom ? buttonRef.current.getBoundingClientRect().bottom + 8 : 64,
                        left: 'auto',
                        right: buttonRef.current?.getBoundingClientRect().right ? window.innerWidth - buttonRef.current.getBoundingClientRect().right : 144
                    }}
                >
                    <div className="px-2 py-1">
                        <div
                            onClick={() => {
                                setShowPullConfirmation(!showPullConfirmation);
                                setShowCommitInput(false);
                            }}
                            className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${showPullConfirmation ? "text-indigo-700 bg-indigo-50" : "text-neutral-600 hover:text-indigo-700 hover:bg-indigo-50"}`}
                        >
                            <CloudDownloadIcon sx={{ fontSize: 18 }} />
                            Git Pull
                        </div>
                        <div
                            onClick={() => {
                                setShowCommitInput(!showCommitInput);
                                setShowPullConfirmation(false);
                            }}
                            className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${showCommitInput ? "text-indigo-700 bg-indigo-50" : "text-neutral-600 hover:text-indigo-700 hover:bg-indigo-50"}`}
                        >
                            <CloudUploadIcon sx={{ fontSize: 18 }} />
                            Git Push
                        </div>
                    </div>

                    {showCommitInput && (
                        <div className="px-3 pb-2 pt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="text-xs font-semibold text-neutral-500 mb-2 mt-1 px-1">Commit Message</div>
                            <textarea
                                className="w-full text-sm p-2 rounded-md border border-neutral-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none bg-white text-neutral-700 disabled:opacity-50"
                                rows={3}
                                placeholder="Enter commit details..."
                                autoFocus
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                disabled={isLoading}
                            />
                            <div className="text-xs font-semibold text-neutral-500 mb-2 mt-2 px-1">Branch Name</div>
                            <input
                                type="text"
                                className="w-full text-sm px-2 py-1.5 rounded-md border border-neutral-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white mb-1"
                                placeholder="main"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <Button size="sm" variant="ghost" onClick={() => setShowCommitInput(false)} className="h-7 text-xs px-2" disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleGitPush} className="h-7 text-xs px-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50" disabled={isLoading || !commitMessage.trim()}>
                                    {isLoading ? "Committing..." : "Commit"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {showPullConfirmation && (
                        <div className="px-3 pb-2 pt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="text-xs font-semibold text-neutral-500 mb-2 mt-1 px-1">Branch Name</div>
                            <input
                                type="text"
                                className="w-full text-sm px-2 py-1.5 rounded-md border border-neutral-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white mb-3"
                                placeholder="main"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" onClick={() => setShowPullConfirmation(false)} className="h-7 text-xs px-2" disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleGitPull} className="h-7 text-xs px-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50" disabled={isLoading}>
                                    {isLoading ? "Pulling..." : "Pull"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Git Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default GitDropdown;
