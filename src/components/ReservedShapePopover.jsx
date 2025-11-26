import { deleteReservations, getShapes } from "@/utils/localStorage.utils";
import Button from "./ui/Button";
import { useEffect, useState } from "react";

export default function ReservedShapePopover({ coords, open, onContinue, onCancel }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768); // You can adjust this breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!open || !coords) return null;

    // Mobile positioning: fixed position below TopBar
    const mobileStyle = {
        position: 'fixed',
        top: '80px', // Adjust this value based on your TopBar height
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        minWidth: '90%',
        maxWidth: '350px',
        padding: '16px',
        fontSize: '0.95rem'
    };

    // Desktop positioning: relative to canvas coordinates (original behavior)
    const desktopStyle = {
        position: 'absolute',
        left: coords.topLeft[0] + 10,
        top: coords.topLeft[1] - 20,
        zIndex: 10,
        minWidth: 180,
        padding: '12px 18px',
        fontSize: '0.95rem'
    };

    const style = isMobile ? mobileStyle : desktopStyle;

    const handleClose = () => {
        deleteReservations(coords)
        const shapes = getShapes()
        onCancel(shapes)
    }

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
                className="dark:bg-dark-800 bg-dark-100 rounded-md shadow-lg border border-green-400 flex flex-col items-center gap-2"
            >
                <div className="dark:text-green-200 text-base font-bold mb-1">Pixels Reserved</div>
                <div className="dark:text-green-100 mb-2 text-xs text-center">
                    You have a reservation for these pixels.
                </div>
                <div className="flex gap-2">
                    <Button className="dark:bg-dark-100 bg-green-300" onClick={onContinue}>Continue</Button>
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
