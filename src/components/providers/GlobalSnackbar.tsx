"use client";

import { Snackbar, Alert } from "@mui/material";
import { useUIStore } from "@/store/uiStore";

export function GlobalSnackbar() {
    const { globalSnackbar, hideSnackbar } = useUIStore();

    return (
        <Snackbar
            open={globalSnackbar.open}
            autoHideDuration={4000}
            onClose={hideSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ zIndex: 6000 }}
        >
            <Alert
                onClose={hideSnackbar}
                severity={globalSnackbar.severity}
                variant="filled"
                sx={{ width: "100%", borderRadius: 2 }}
            >
                {globalSnackbar.message}
            </Alert>
        </Snackbar>
    );
}
