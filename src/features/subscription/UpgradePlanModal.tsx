"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import {
    Close as CloseIcon,
    CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";

interface UpgradePlanModalProps {
    open: boolean;
    onClose: () => void;
    plans: any[];
    currentTier: string;
    isLoading: boolean;
    onUpgradeClick: () => void;
}

export function UpgradePlanModal({ open, onClose, plans, currentTier, isLoading, onUpgradeClick }: UpgradePlanModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200"
            style={{ zIndex: 999999, backgroundColor: "rgba(0, 0, 0, 0.47)" }}
            onClick={onClose}
        >
            <div
                className="bg-gray-100 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-400 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-700 text-white text-base font-bold p-1.5 rounded-xl shadow-lg shadow-indigo-900/10">
                            CQ
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {currentTier === "FREE" ? "Upgrade Plan" : "Current Plan"}
                            </h3>
                            <p className="text-xs text-gray-500">
                                You are on the <span className="font-semibold text-neutral-700">{currentTier}</span> plan
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-200 rounded-full p-1.5 transition-colors"
                    >
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </button>
                </div>

                {/* Plans */}
                <div className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-7 h-7 border-1 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                <span className="text-sm text-neutral-500">Loading plans...</span>
                            </div>
                        </div>
                    ) : plans.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {plans.map((plan: any) => {
                                const isFree = plan.price === 0;
                                const isCurrent = plan.status === "active" || plan.name === currentTier;

                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-xl border p-5 transition-all duration-200 overflow-hidden border-1 border-gray-400 ${isCurrent
                                            ? isFree
                                                ? "bg-neutral-50 border-neutral-300 shadow-sm"
                                                : "bg-gradient-to-b from-indigo-50 to-white border-indigo-300 shadow-md shadow-indigo-100/50"
                                            : isFree
                                                ? "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                                                : "bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50"
                                            }`}
                                    >


                                        {/* Plan name + badge */}
                                        <div className="flex items-center justify-between mb-3 mt-1">
                                            <h4 className={`text-base font-bold ${isFree ? "text-neutral-800" : "text-indigo-900"}`}>
                                                {plan.name}
                                            </h4>
                                            {isCurrent && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFree
                                                    ? "bg-neutral-700 text-white"
                                                    : "bg-indigo-600 text-white shadow-sm"
                                                    }`}>
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <span className={`text-2xl font-extrabold ${isFree ? "text-neutral-900" : "text-indigo-900"}`}>
                                                ₹{plan.price}
                                            </span>
                                            {plan.duration_days && (
                                                <span className="text-xs text-neutral-500 ml-1">/ {plan.duration_days} days</span>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-start gap-2">
                                                <CheckIcon
                                                    sx={{ fontSize: 16 }}
                                                    className={isFree ? "text-neutral-400 mt-0.5" : "text-indigo-500 mt-0.5"}
                                                />
                                                <span className="text-xs text-neutral-700">
                                                    {plan.max_upload_size}{plan.Unit || plan.unit || ""} file support
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckIcon
                                                    sx={{ fontSize: 16 }}
                                                    className={plan.git_access ? (isFree ? "text-neutral-400 mt-0.5" : "text-indigo-500 mt-0.5") : "text-neutral-300 mt-0.5"}
                                                />
                                                <span className={`text-xs ${plan.git_access ? "text-neutral-700" : "text-neutral-400 line-through"}`}>
                                                    {plan.git_access ? "Full Git integration" : "No Git integration"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Days remaining */}
                                        {isCurrent && plan.days_remaining != null && (
                                            <div className="text-[11px] text-indigo-600 font-medium mb-3">
                                                {plan.days_remaining} days remaining
                                            </div>
                                        )}

                                        {/* CTA */}
                                        {!isCurrent && !isFree && currentTier === "FREE" && (
                                            <Button
                                                size="sm"
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 font-semibold shadow-sm shadow-indigo-200"
                                                onClick={() => {
                                                    onClose();
                                                    onUpgradeClick();
                                                }}
                                            >
                                                Upgrade Now
                                            </Button>
                                        )}
                                        {isCurrent && (
                                            <div className={`w-full text-center py-1.5 rounded-lg text-xs font-semibold ${isFree ? "bg-neutral-100 text-neutral-500" : "bg-indigo-100 text-indigo-700"
                                                }`}>
                                                Active
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                            <div className="bg-neutral-200 text-neutral-400 text-lg font-bold p-2 rounded-xl mb-2">CQ</div>
                            <p className="text-sm">No plans available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
