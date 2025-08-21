import React from "react";
import Button from "./ui/Button";
import { useAuth } from "./AuthProvider";

export default function TransactionPopover({ coords, open, onClose, onCompleteTransaction }) {

    const { isAuthenticated } = useAuth()


    if (!open || !coords) return null;
    const style = {
        position: 'absolute',
        left: coords.topleft.x + 20,
        top: coords.topleft.y - 40,
        zIndex: 100,
    };
    return (
        <div style={style} className="bg-dark-800 rounded-lg px-8 py-6 shadow-lg border border-green-400">
            <div className="text-green-200 text-xl font-bold mb-2">Complete Transaction</div>
            <div className="text-green-100 mb-4">Ready to purchase your reserved pixels?</div>
            <Button
                onClick={() => {
                    if (isAuthenticated) {
                        onCompleteTransaction();
                    } else {
                        // Save current location for redirect after login
                        localStorage.setItem("returnAfterAuth", window.location.pathname);
                        window.location.href = "/auth/login";
                    }
                }}
            >Pay & Complete</Button>
            <Button
                onClick={onClose}
                variant="secondary"
                style={{ marginLeft: "1rem" }}
            >Cancel</Button>
        </div>
    );
}
