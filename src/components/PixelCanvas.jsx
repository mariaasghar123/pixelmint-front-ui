"use client";
import { useEffect, useRef } from "react";
import { Canvas, Rect, Line } from "fabric";

const CANVAS_WIDTH = 1250;
const CANVAS_HEIGHT = 1000;
const GRID_SIZE = 10;

const propShapes = [
    { left: 200, top: 200, width: 100, height: 100 },
    { left: 600, top: 400, width: 150, height: 100 },
    { left: 900, top: 800, width: 120, height: 130 },
];

export default function PixelCanvasFabric() {
    const canvasRef = useRef();

    useEffect(() => {
        // Create Fabric canvas
        const canvas = new Canvas(canvasRef.current, {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            backgroundColor: "#0B3024",
            selection: true,
            preserveObjectStacking: true,
        });

        // Draw grid lines (do once, not selectable)
        for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
            canvas.add(new Line([x, 0, x, CANVAS_HEIGHT], {
                stroke: "#224C38",
                selectable: false,
                evented: false,
            }));
        }
        for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
            canvas.add(new Line([0, y, CANVAS_WIDTH, y], {
                stroke: "#224C38",
                selectable: false,
                evented: false,
            }));
        }

        // Add prop shapes (obstacles)
        const allShapes = []; // Track all prop and user shapes for collision
        propShapes.forEach((shape) => {
            const r = new Rect({
                left: shape.left,
                top: shape.top,
                width: shape.width,
                height: shape.height,
                fill: "#FF4F6B",
                selectable: false,
                evented: false,
                stroke: "#B0222E",
                strokeWidth: 2,
                opacity: 0.9,
            });
            r._isProp = true; // Custom flag for collision
            canvas.add(r);
            allShapes.push(r);
        });

        // Track pan and zoom
        let isPanning = false;
        let lastPosX = 0;
        let lastPosY = 0;
        let isSelecting = false;

        // Helper: check if selection overlaps any shape in allShapes
        function overlapsAny(left, top, width, height) {
            for (const obj of allShapes) {
                const oLeft = obj.left;
                const oTop = obj.top;
                const oWidth = obj.width;
                const oHeight = obj.height;
                if (!(
                    left + width <= oLeft ||
                    left >= oLeft + oWidth ||
                    top + height <= oTop ||
                    top >= oTop + oHeight
                )) {
                    return true;
                }
            }
            return false;
        }

        canvas.on('mouse:down', function(opt) {
            if (opt.e.ctrlKey || opt.e.button === 1) {
                isPanning = true;
                canvas.setCursor('grab');
                lastPosX = opt.e.clientX;
                lastPosY = opt.e.clientY;
            } else if (opt.e.button === 0) {
                isSelecting = true;
                const pointer = canvas.getPointer(opt.e);
                canvas._selectionStart = {
                    x: Math.max(0, Math.min(CANVAS_WIDTH - GRID_SIZE, Math.floor(pointer.x / GRID_SIZE) * GRID_SIZE)),
                    y: Math.max(0, Math.min(CANVAS_HEIGHT - GRID_SIZE, Math.floor(pointer.y / GRID_SIZE) * GRID_SIZE)),
                };
                canvas._selectionRect = new Rect({
                    left: canvas._selectionStart.x,
                    top: canvas._selectionStart.y,
                    width: 0,
                    height: 0,
                    fill: "rgba(79,255,176,0.3)",
                    selectable: false,
                    evented: false,
                });
                canvas.add(canvas._selectionRect);
            }
        });

        canvas.on('mouse:move', function(opt) {
            if (isPanning) {
                const e = opt.e;
                const deltaX = e.clientX - lastPosX;
                const deltaY = e.clientY - lastPosY;
                lastPosX = e.clientX;
                lastPosY = e.clientY;
                canvas.relativePan({ x: deltaX, y: deltaY });
            } else if (isSelecting && canvas._selectionStart && canvas._selectionRect) {
                const pointer = canvas.getPointer(opt.e);
                const sx = canvas._selectionStart.x, sy = canvas._selectionStart.y;
                const ex = Math.max(0, Math.min(CANVAS_WIDTH - GRID_SIZE, Math.floor(pointer.x / GRID_SIZE) * GRID_SIZE));
                const ey = Math.max(0, Math.min(CANVAS_HEIGHT - GRID_SIZE, Math.floor(pointer.y / GRID_SIZE) * GRID_SIZE));
                canvas._selectionRect.set({
                    left: Math.min(sx, ex),
                    top: Math.min(sy, ey),
                    width: Math.abs(ex - sx) + GRID_SIZE,
                    height: Math.abs(ey - sy) + GRID_SIZE,
                });
                canvas.renderAll();
            }
        });

        canvas.on('mouse:up', function(opt) {
            if (isPanning) {
                isPanning = false;
                canvas.setCursor('default');
                return;
            }

            if (isSelecting && canvas._selectionStart && canvas._selectionRect) {
                const { left, top, width, height } = canvas._selectionRect;
                // Only accept if area >= 100 pixels
                if (width * height < 100) {
                    // Too small, remove and abort
                    canvas.remove(canvas._selectionRect);
                    canvas._selectionStart = null;
                    canvas._selectionRect = null;
                    isSelecting = false;
                    console.log("Selection area too small (<100px).");
                    return;
                }

                // Check overlap with any prop or user shape
                if (overlapsAny(left, top, width, height)) {
                    // Remove selection box and abort
                    canvas.remove(canvas._selectionRect);
                    canvas._selectionStart = null;
                    canvas._selectionRect = null;
                    isSelecting = false;
                    console.log("Selection overlaps a shape. Selection cancelled.");
                    return;
                }

                // Compute top-left and bottom-right coordinates
                const x1 = left;
                const y1 = top;
                const x2 = left + width - GRID_SIZE;
                const y2 = top + height - GRID_SIZE;
                console.log("Selected area:");
                console.log("Top-left:", { x: x1, y: y1 });
                console.log("Bottom-right:", { x: x2, y: y2 });

                // Leave selection box (make opaque, add to allShapes)
                canvas._selectionRect.set({
                    fill: "#4FFFB0",
                    opacity: 0.6,
                    selectable: false,
                    evented: false,
                });
                canvas.renderAll();
                allShapes.push(canvas._selectionRect);

                canvas._selectionStart = null;
                canvas._selectionRect = null;
                isSelecting = false;
            }
        });

        // Zoom with mouse wheel
        canvas.on("mouse:wheel", function(opt) {
            const e = opt.e;
            let zoom = canvas.getZoom();
            zoom *= 0.999 ** e.deltaY;
            zoom = Math.max(0.2, Math.min(4, zoom));
            canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoom);
            e.preventDefault();
            e.stopPropagation();
        });

        // Clean up
        return () => {
            canvas.dispose();
        };
    }, []);

    return (
        <div style={{ width: "100%", maxWidth: "100vw", overflow: "auto" }}>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    margin: "auto",
                    border: "1px solid #224C38",
                    touchAction: "none",
                    cursor: "crosshair",
                }}
            />
        </div>
    );
}
