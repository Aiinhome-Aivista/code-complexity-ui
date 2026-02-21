"use client";

import { useAuthStore } from "@/store/authStore";
import { PaymentModal } from "@/features/subscription/PaymentModal";

export function PaymentModalWrapper() {
    const { isPaymentModalOpen, closePaymentModal } = useAuthStore();

    return (
        <PaymentModal
            open={isPaymentModalOpen}
            onClose={closePaymentModal}
            onSuccess={(method: string) => {
                closePaymentModal();
                // Option to add a global snackbar dispatch here instead of alert later if needed
                alert(`Payment successful via ${method.toUpperCase()}! You are now a Pro.`);
            }}
        />
    );
}
