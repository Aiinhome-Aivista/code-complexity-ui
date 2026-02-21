"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (paymentMethod: string) => void;
}

export function PaymentModal({ open, onClose, onSuccess }: PaymentModalProps) {
    const { user } = useAuthStore();
    const [paymentMethod, setPaymentMethod] = useState<"card" | "netbanking">("card");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" style={{ zIndex: 999999 }}>
            <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] relative">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upgrade to Pro</h3>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">Complete your payment to unlock all features</p>
                    </div>
                    <button
                        onClick={onClose}
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
                        onClick={() => onSuccess(paymentMethod)}
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
    );
}
