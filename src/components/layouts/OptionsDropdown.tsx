"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    Logout as LogoutIcon,
    WorkspacePremium as PremiumIcon,
    Settings as SettingsIcon,
    GitHub as GitHubIcon,
    Visibility,
    VisibilityOff,
    PersonOutline as PersonOutlineIcon,
    WarningAmberRounded as WarningIcon,
} from "@mui/icons-material";
import { Snackbar, Alert, Box } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { useAuthStore } from "@/store/authStore";
import { commonService } from "@/services/common_apiservice";
import { useRouter } from "next/navigation";
import { UpgradePlanModal } from "@/features/subscription/UpgradePlanModal";

export function OptionsDropdown() {
    const { user, logout, openPaymentModal } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<"none" | "git">("none");
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [gitConfig, setGitConfig] = useState({ username: "", email: "", pat: "" });
    const [showPat, setShowPat] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [planData, setPlanData] = useState<{ current_tier?: string; plans: any[] }>({ current_tier: "FREE", plans: [] });
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" }>({
        open: false,
        message: "",
        severity: "info",
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch plan data when dropdown is opened
    useEffect(() => {
        if (isOpen && user?.id && planData.plans.length === 0) {
            setIsLoadingPlans(true);
            commonService.getPlansByUser(user.id)
                .then(data => {
                    if (data && typeof data === 'object') {
                        if (data.plans) {
                            setPlanData({ current_tier: data.current_tier || "FREE", plans: data.plans });
                        } else if (Array.isArray(data)) {
                            setPlanData({ current_tier: "FREE", plans: data });
                        } else {
                            setPlanData(prev => ({ ...prev, plans: [data] }));
                        }
                    }
                })
                .catch(err => console.error("Failed to fetch user plans:", err))
                .finally(() => setIsLoadingPlans(false));
        }
    }, [isOpen, user?.id, planData.plans.length]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveSubmenu("none");
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleLogoutClick = () => {
        setIsOpen(false);
        setLogoutConfirmOpen(true);
    };

    const handleCancelLogout = () => {
        setLogoutConfirmOpen(false);
    };

    const performLogout = () => {
        setLogoutConfirmOpen(false);
        logout();
        localStorage.removeItem("token");
        localStorage.removeItem("userdata");
        localStorage.removeItem("auth-storage");
        router.push("/login");
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer flex items-center gap-2 text-neutral-600 font-medium hover:text-indigo-700 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 rounded-lg px-3 ${isOpen ? "bg-indigo-50 text-indigo-700 border-indigo-100" : ""}`}
            >
                <SettingsIcon sx={{ fontSize: 18 }} />
                <span className="text-sm">Settings</span>
            </Button>

            {isOpen && mounted && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed top-16 right-4 w-64 bg-gray-200 rounded-xl shadow-xl shadow-gray-300/70 border border-gray-300 py-1.5 z-[99999] origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
                >
                    {/* User Info */}
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-700 font-medium">
                            <PersonOutlineIcon sx={{ fontSize: 18 }} className="text-indigo-500" />
                            <span className="text-neutral-800 font-bold">{user?.name || "User"}</span>
                        </div>
                    </div>

                    {/* Plan Section */}
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                        <div className="flex flex-col gap-1 text-sm text-neutral-700 font-medium rounded-lg cursor-default">
                            <div className="flex items-center gap-2">
                                <PremiumIcon sx={{ fontSize: 18 }} className="text-amber-500" />
                                <span className="text-neutral-500 font-semibold">Plan:</span>
                                <span className="text-neutral-800 font-bold">{planData.current_tier || "FREE"}</span>
                            </div>
                            {planData.plans.find(p => p.name === planData.current_tier)?.days_remaining != null && (
                                <div className="pl-7 text-xs text-neutral-500">
                                    {planData.plans.find(p => p.name === planData.current_tier)?.days_remaining} days remaining
                                </div>
                            )}
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                setIsPlanModalOpen(true);
                            }}
                            className="mt-1 pl-7 text-xs font-semibold cursor-pointer transition-colors text-indigo-600 hover:text-indigo-800"
                        >
                            {planData.current_tier === "FREE" ? "Upgrade Plan" : "View Current Plan"}
                        </div>
                    </div>

                    {/* Git Config */}
                    <div className="px-2 pb-1 border-b border-neutral-100 mb-1">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                if (activeSubmenu !== "git") {
                                    setActiveSubmenu("git");
                                    const userId = useAuthStore.getState().user?.id || 1;
                                    commonService.fetchGitConfig(userId).then((data) => {
                                        if (data) {
                                            setGitConfig({
                                                username: data.git_username || "",
                                                email: data.git_email || "",
                                                pat: data.git_token || "",
                                            });
                                        }
                                    }).catch((err) => console.error("Failed to fetch git config", err));
                                } else {
                                    setActiveSubmenu("none");
                                }
                            }}
                            className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${activeSubmenu === "git" ? "bg-indigo-50 text-indigo-700" : "text-neutral-600 hover:text-indigo-700 hover:bg-indigo-50"}`}
                        >
                            <GitHubIcon sx={{ fontSize: 18 }} />
                            Config Git
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="px-2">
                        <div
                            onClick={handleLogoutClick}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50/40 cursor-pointer transition-colors group"
                        >
                            <LogoutIcon sx={{ fontSize: 18 }} className="group-hover:text-red-500 transition-colors" />
                            Sign out
                        </div>
                    </div>



                    {/* Git Config Panel */}
                    {activeSubmenu === "git" && (
                        <div
                            className="absolute top-0 right-full mr-2 w-72 bg-gray-200 rounded-xl shadow-xl shadow-gray-300/70 border border-gray-300 p-4 z-[99999] animate-in fade-in slide-in-from-right-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h4 className="text-neutral-800 font-bold text-sm mb-3">Git Configuration</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Username</label>
                                    <input
                                        type="text"
                                        className="w-full text-sm px-2 py-1.5 rounded-md border border-neutral-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                        placeholder="GitHub Username"
                                        value={gitConfig.username}
                                        onChange={(e) => setGitConfig({ ...gitConfig, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full text-sm px-2 py-1.5 rounded-md border border-neutral-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                        placeholder="git@example.com"
                                        value={gitConfig.email}
                                        onChange={(e) => setGitConfig({ ...gitConfig, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-500 mb-1">PAT Token</label>
                                    <div className="relative">
                                        <input
                                            type={showPat ? "text" : "password"}
                                            className="w-full text-sm pl-2 pr-8 py-1.5 rounded-md border border-neutral-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                                            placeholder="ghp_xxxxxxxxxxxx"
                                            value={gitConfig.pat}
                                            onChange={(e) => setGitConfig({ ...gitConfig, pat: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPat(!showPat)}
                                            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                                        >
                                            {showPat ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-3"
                                        onClick={() => {
                                            const userId = useAuthStore.getState().user?.id || 1;
                                            commonService.updateGitConfig(userId, {
                                                git_username: gitConfig.username,
                                                git_email: gitConfig.email,
                                                git_token: gitConfig.pat,
                                            }).then(() => {
                                                setSnackbar({ open: true, message: "Git configuration saved successfully", severity: "success" });
                                                setActiveSubmenu("none");
                                            }).catch((err) => {
                                                console.error("Failed to save git config", err);
                                                setSnackbar({ open: true, message: "Failed to save configuration", severity: "error" });
                                            });
                                        }}
                                    >
                                        Save Configuration
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Upgrade Plan Modal */}
            <UpgradePlanModal
                open={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                plans={planData.plans}
                currentTier={planData.current_tier || "FREE"}
                isLoading={isLoadingPlans}
                onUpgradeClick={openPaymentModal}
            />

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Logout Confirmation */}
            <Dialog open={logoutConfirmOpen} onOpenChange={handleCancelLogout}>
                <DialogContent className="sm:max-w-sm bg-gray-100 dark:bg-neutral-900 border-gray-300 dark:border-neutral-800 p-0 overflow-hidden">
                    <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 space-y-4">
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-1 shadow-sm">
                            <LogoutIcon sx={{ fontSize: 32 }} className="text-indigo-600 dark:text-indigo-500" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-center text-neutral-900 dark:text-white">Sign Out</DialogTitle>
                            <DialogDescription className="text-center text-neutral-600 dark:text-neutral-400 text-sm mt-2">
                                Are you sure you want to sign out of your account?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex w-full mt-4 gap-3 sm:justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                                onClick={handleCancelLogout}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-900/20 transition-all hover:scale-105 border-0"
                                onClick={performLogout}
                            >
                                Sign Out
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
}

export default OptionsDropdown;
