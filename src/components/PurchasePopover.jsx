import { deleteReservations, getShapes } from "@/utils/localStorage.utils";
import Button from "./ui/Button";
import { useEffect, useState } from "react";

export default function PurchasePopover({ coords, open, onContinuePayment, onCancel }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!open || !coords) return null;

    // Mobile positioning: fixed position below TopBar
    const mobileStyle = {
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        minWidth: '90%',
        maxWidth: '350px',
        padding: '16px',
        fontSize: '0.95rem'
    };

    // Desktop positioning: relative to canvas coordinates
    const desktopStyle = {
        position: 'absolute',
        left: coords.topLeft[0] + 10,
        top: coords.topLeft[1] - 20,
        zIndex: 10,
        minWidth: 200,
        padding: '12px 18px',
        fontSize: '0.95rem'
    };

    const style = isMobile ? mobileStyle : desktopStyle;

    const handleClose = () => {
        deleteReservations(coords);
        const shapes = getShapes();
        onCancel(shapes);
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isMobile && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={handleClose}
                />
            )}

            <div
                style={style}
                className="bg-dark-800 rounded-md shadow-lg border border-green-100 flex flex-col items-center gap-2"
            >
                <div className="text-green-200 text-base font-bold mb-1">Ready for Payment</div>
                <div className="text-green-100 mb-2 text-xs text-center">
                    Complete your pixel purchase
                </div>
                <div className="flex gap-2">
                    <Button onClick={onContinuePayment}>Pay Now</Button>
                    <Button
                        className="!bg-error !hover:bg-error/20 !border-none"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    );
}
