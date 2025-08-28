import { deleteReservations, getShapes } from "@/utils/localStorage.utils";
import Button from "./ui/Button";

export default function ReservedShapePopover({ coords, open, onContinue, onCancel }) {
    if (!open || !coords) return null;
    const style = {
        position: 'absolute',
        left: coords.topLeft[0] + 10,
        top: coords.topLeft[1] - 20,
        zIndex: 10,
        minWidth: 180,
        padding: '12px 18px',
        fontSize: '0.95rem'
    };

    const handleClose = () => {
        deleteReservations(coords)
        const shapes = getShapes()
        onCancel(shapes)
    }

    return (
        <div style={style} className="bg-dark-800 rounded-md shadow-lg border border-green-400 flex flex-col items-center gap-2">
            <div className="text-green-200 text-base font-bold mb-1">Pixels Reserved</div>
            <div className="text-green-100 mb-2 text-xs text-center">You have a reservation for these pixels.</div>
            <div className="flex gap-2">
                <Button className="" onClick={onContinue}>Continue</Button>
                <Button className="!bg-error !hover:bg-error/20 !border-none" onClick={handleClose}>Cancel</Button>
            </div>
        </div>
    );
}
