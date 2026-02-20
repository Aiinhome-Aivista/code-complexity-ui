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
} from "@mui/icons-material";
import { Snackbar, Alert, Box } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { commonService } from "@/services/common_apiservice";
import { useRouter } from "next/navigation";

export function OptionsDropdown() {
    const { user, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<"none" | "plan" | "git">("none");
    const [gitConfig, setGitConfig] = useState({ username: "", email: "", pat: "" });
    const [showPat, setShowPat] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "netbanking">("card");
    const [mounted, setMounted] = useState(false);
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
                        <div className="flex items-center justify-between text-sm text-neutral-700 font-medium rounded-lg cursor-default">
                            <div className="flex items-center gap-2">
                                <PremiumIcon sx={{ fontSize: 18 }} className="text-amber-500" />
                                <span className="text-neutral-500 font-semibold">Plan:</span>
                                <span className="text-neutral-800 font-bold">Free Tier</span>
                            </div>
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveSubmenu(activeSubmenu === "plan" ? "none" : "plan");
                            }}
                            className={`mt-1 pl-7 text-xs font-semibold cursor-pointer transition-colors ${activeSubmenu === "plan" ? "text-indigo-800" : "text-indigo-600 hover:text-indigo-800"}`}
                        >
                            Upgrade Plan
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

                    {/* Plan Upgrade Panel */}
                    {activeSubmenu === "plan" && (
                        <div
                            className="absolute top-0 right-full mr-2 w-72 bg-gray-200 rounded-xl shadow-xl shadow-gray-300/70 border border-gray-300 p-4 z-[99999] animate-in fade-in slide-in-from-right-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h4 className="text-neutral-800 font-bold text-sm mb-3">Upgrade Plan</h4>
                            <div className="space-y-3">
                                <div className="p-3 bg-white rounded-lg border border-neutral-200 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-neutral-300"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-neutral-800 text-sm">Free Tier</div>
                                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">Current</span>
                                    </div>
                                    <ul className="text-xs text-neutral-600 space-y-1 ml-1">
                                        <li className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-neutral-400"></div>10KB file support
                                        </li>
                                        <li className="flex items-center gap-1.5 opacity-50">
                                            <div className="w-1 h-1 rounded-full bg-neutral-300"></div>No Git integration
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 relative overflow-hidden group hover:border-indigo-300 transition-colors cursor-pointer">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-indigo-900 text-sm">Pro Tier</div>
                                    </div>
                                    <ul className="text-xs text-neutral-700 space-y-1 ml-1">
                                        <li className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-indigo-400"></div>10MB file support
                                        </li>
                                        <li className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-indigo-400"></div>Full Git integration
                                        </li>
                                    </ul>
                                    <Button size="sm" className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7" onClick={() => setShowPaymentModal(true)}>
                                        Upgrade Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

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

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Logout Confirmation */}
            <Snackbar open={logoutConfirmOpen} onClose={handleCancelLogout} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert
                    severity="warning"
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: 2,
                        alignItems: "center",
                        "& .MuiAlert-message": { display: "flex", alignItems: "center", gap: 2 },
                    }}
                    action={
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="sm" variant="ghost" onClick={handleCancelLogout} className="text-white hover:bg-white/20">
                                Cancel
                            </Button>
                            <Button size="sm" onClick={performLogout} className="bg-red-700 hover:bg-red-800 text-white border-0">
                                Logout
                            </Button>
                        </Box>
                    }
                >
                    Are you sure you want to sign out?
                </Alert>
            </Snackbar>
            {/* Payment Modal */}
            {showPaymentModal && mounted && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upgrade to Pro</h3>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">Complete your payment to unlock all features</p>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full p-1 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-5 overflow-y-auto">
                            {/* Payment Method Selector */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setPaymentMethod("card")}
                                    className={`cursor-pointer py-2 px-3 flex flex-col items-center justify-center gap-1 border rounded-xl text-xs font-semibold transition-all ${paymentMethod === "card"
                                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm"
                                        : "border-gray-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-600 dark:text-neutral-400"
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    Card
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("netbanking")}
                                    className={`cursor-pointer py-2 px-3 flex flex-col items-center justify-center gap-1 border rounded-xl text-xs font-semibold transition-all ${paymentMethod === "netbanking"
                                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm"
                                        : "border-gray-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-600 dark:text-neutral-400"
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    Netbanking
                                </button>
                            </div>

                            {/* Card Content */}
                            {paymentMethod === "card" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[280px]">
                                    <div className="w-full h-36 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden shrink-0">
                                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="font-mono tracking-widest opacity-80">XXXX XXXX XXXX 4242</div>
                                            <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 9H21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                        <div className="mt-8 flex justify-between items-end relative z-10">
                                            <div>
                                                <div className="text-[10px] opacity-60 uppercase mb-0.5">Card Holder</div>
                                                <div className="text-sm font-medium tracking-wide">{user?.name || "JOHN DOE"}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] opacity-60 uppercase mb-0.5">Expires</div>
                                                <div className="text-sm font-medium tracking-wide">12/28</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1.5">Card Information</label>
                                            <div className="flex flex-col bg-white dark:bg-neutral-950 rounded-lg border border-gray-300 dark:border-neutral-700 overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all dark:text-white">
                                                <input type="text" placeholder="Card number" className="w-full text-sm px-3 py-2.5 border-b border-gray-200 dark:border-neutral-800 bg-transparent outline-none" />
                                                <div className="flex divide-x divide-gray-200 dark:divide-neutral-800">
                                                    <input type="text" placeholder="MM / YY" className="w-1/2 text-sm px-3 py-2.5 bg-transparent outline-none" />
                                                    <input type="text" placeholder="CVC" className="w-1/2 text-sm px-3 py-2.5 bg-transparent outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1.5">Name on card</label>
                                            <input type="text" placeholder="John Doe" className="w-full text-sm px-3 py-2.5 bg-white dark:bg-neutral-950 rounded-lg border border-gray-300 dark:border-neutral-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Netbanking Content */}
                            {paymentMethod === "netbanking" && (
                                <div className="space-y-5 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[280px]">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-2">Popular Banks</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-3 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-gray-700 dark:text-neutral-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors text-center">HDFC Bank</div>
                                            <div className="p-3 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-gray-700 dark:text-neutral-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors text-center">ICICI Bank</div>
                                            <div className="p-3 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-gray-700 dark:text-neutral-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors text-center">SBI Bank</div>
                                            <div className="p-3 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-gray-700 dark:text-neutral-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors text-center">Axis Bank</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1">Other Banks</label>
                                        <select className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
                                            <option value="">Select your bank</option>
                                            <option value="1">Kotak Mahindra Bank</option>
                                            <option value="2">Bank of Baroda</option>
                                            <option value="3">Punjab National Bank</option>
                                            <option value="4">Canara Bank</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer / Actions */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-800 flex flex-col gap-3 shrink-0">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-600 dark:text-neutral-400">Total</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">$29.00 <span className="text-xs text-gray-500 font-normal">/mo</span></span>
                            </div>
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                                onClick={() => {
                                    setSnackbar({ open: true, message: `Payment successful via ${paymentMethod.toUpperCase()}! You are now a Pro.`, severity: "success" });
                                    setShowPaymentModal(false);
                                    setActiveSubmenu("none");
                                    setIsOpen(false);
                                }}
                            >
                                {paymentMethod === "netbanking" ? "Proceed to Bank" : "Pay $29.00"}
                            </Button>
                            <p className="text-[10px] text-center text-gray-400 mt-1 flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Payments are secure and encrypted
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default OptionsDropdown;
