"use client";

import { Button } from "@/components/ui/Button";

interface UpgradePlanPanelProps {
    plans: any[];
    currentTier: string;
    isLoading: boolean;
    onUpgradeClick: () => void;
}

export function UpgradePlanPanel({ plans, currentTier, isLoading, onUpgradeClick }: UpgradePlanPanelProps) {
    return (
        <div
            className="absolute top-0 right-full mr-2 w-72 bg-gray-200 rounded-xl shadow-xl shadow-gray-300/70 border border-gray-300 p-4 z-[99999] animate-in fade-in slide-in-from-right-2 duration-200"
            onClick={(e) => e.stopPropagation()}
        >
            <h4 className="text-neutral-800 font-bold text-sm mb-3">{currentTier === "FREE" ? "Upgrade Plan" : "Current Plan"}</h4>
            <div className="space-y-3">
                {isLoading ? (
                    <div className="text-center py-4 text-xs text-neutral-500">Loading plans...</div>
                ) : plans.length > 0 ? (
                    plans.map((plan: any) => {
                        const isFree = plan.price === 0;

                        const isCurrent = plan.status === "active" || plan.name === currentTier;

                        if (isFree) {
                            return (
                                <div key={plan.id} className="p-3 bg-white rounded-lg border border-neutral-200 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-neutral-300"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-neutral-800 text-sm">{plan.name}</div>
                                        {isCurrent && <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">Current</span>}
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-sm font-bold text-neutral-900">₹{plan.price}</span>
                                        {plan.duration_days && <span className="text-[10px] text-neutral-500 ml-1">/{plan.duration_days} days</span>}
                                    </div>
                                    <ul className="text-xs text-neutral-600 space-y-1 ml-1">
                                        <li className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
                                            {plan.max_upload_size}{plan.Unit || plan.unit || ""} file support
                                        </li>
                                        <li className="flex items-center gap-1.5 opacity-50">
                                            <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
                                            {plan.git_access ? "Git integration" : "No Git integration"}
                                        </li>
                                    </ul>
                                </div>
                            );
                        }

                        // Pro/Paid Plan
                        return (
                            <div key={plan.id} className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 relative overflow-hidden group hover:border-indigo-300 transition-colors cursor-pointer">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-bold text-indigo-900 text-sm">{plan.name}</div>
                                    {isCurrent && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-200">Current</span>}
                                </div>
                                <div className="mb-2">
                                    <span className="text-sm font-bold text-indigo-900">₹{plan.price}</span>
                                    {plan.duration_days && <span className="text-[10px] text-indigo-700/60 ml-1">/{plan.duration_days} days</span>}
                                </div>
                                <ul className="text-xs text-neutral-700 space-y-1 ml-1">
                                    <li className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                                        {plan.max_upload_size}{plan.Unit || plan.unit || ""} file support
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                                        {plan.git_access ? "Full Git integration" : "No Git integration"}
                                    </li>
                                </ul>
                                {currentTier === "FREE" && (
                                    <Button size="sm" className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7" onClick={onUpgradeClick}>
                                        Upgrade Now
                                    </Button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-4 text-xs text-neutral-500">No plans available</div>
                )}
            </div>
        </div>
    );
}
