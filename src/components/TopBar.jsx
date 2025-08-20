import Button from "./ui/Button";
import { FaExpand } from "react-icons/fa";

function TopBar({ mouseGridPos, lastShapeCoords }) {
    return (
        <div
            style={{
                width: "100%",
                background: "#0d2320",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                boxSizing: "border-box",
                borderBottom: "1px solid #142d29",
                minHeight: 48,
            }}
        >
            <div style={{ display: "flex", gap: 12 }}>
                <div
                    className="py-3 px-4"
                    style={{
                        background: "#18312c",
                        borderRadius: 6,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        fontWeight: 500,
                    }}
                >
                    <span>
                        Position: {mouseGridPos.x !== null && mouseGridPos.y !== null
                            ? `(${mouseGridPos.x}, ${mouseGridPos.y})`
                            : "(–,–)"}
                    </span>
                    <span>
                        Block: 10×10 pixels ($10)
                    </span>
                </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
                <Button>
                    Buy Pixels
                </Button>
                <button className="cursor-pointer p-2 rounded bg-[#18312c] hover:bg-[#19992c]/80 transition duration-150 ease">
                    <FaExpand size={20} />
                </button>
            </div>
        </div>
    );
}


export default TopBar;
