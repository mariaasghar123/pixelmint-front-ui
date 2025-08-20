"use client";
import React, { useRef, useEffect, useState } from "react";
import TopBar from "./TopBar";
import { toast } from "react-toastify";

const GRID_WIDTH = 125;
const GRID_HEIGHT = 100;
const CELL_SIZE = 10;

function setGridCell(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
}

function drawRectOnGrid(ctx, start, end, cellSize, color) {
    const x1 = Math.min(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const x2 = Math.max(start.x, end.x);
    const y2 = Math.max(start.y, end.y);
    for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
            setGridCell(ctx, x, y, cellSize, color);
        }
    }
}
function rectOverlaps(rect, existingRects) {
    const x1 = Math.min(rect.start.x, rect.end.x);
    const y1 = Math.min(rect.start.y, rect.end.y);
    const x2 = Math.max(rect.start.x, rect.end.x);
    const y2 = Math.max(rect.start.y, rect.end.y);

    for (const r of existingRects) {
        const rx1 = Math.min(r.start.x, r.end.x);
        const ry1 = Math.min(r.start.y, r.end.y);
        const rx2 = Math.max(r.start.x, r.end.x);
        const ry2 = Math.max(r.start.y, r.end.y);

        const overlap = !(x2 < rx1 || x1 > rx2 || y2 < ry1 || y1 > ry2);
        if (overlap) return true;
    }
    return false;
}

const propShapes = [
    { start: { x: 20, y: 20 }, end: { x: 29, y: 29 }, color: "#E44A4A" },
    { start: { x: 50, y: 80 }, end: { x: 60, y: 90 }, color: "#E44A4A" },
    { start: { x: 100, y: 200 }, end: { x: 110, y: 220 }, color: "#E44A4A" }
];

export default function PixelGridCanvas() {
    const canvasRef = useRef(null);

    // Zoom states
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [panning, setPanning] = useState(false);
    const [panStart, setPanStart] = useState(null);

    // Draw states
    const [drawing, setDrawing] = useState(false);
    const [startCell, setStartCell] = useState(null);
    const [endCell, setEndCell] = useState(null);
    const [drawnRects, setDrawnRects] = useState([]);

    // Mouse position in grid coords
    const [mouseGridPos, setMouseGridPos] = useState({ x: null, y: null });

    // Last logged shape coords
    const [lastShapeCoords, setLastShapeCoords] = useState(null);

    // Canvas size in px (not grid size)
    const [canvasPxSize, setCanvasPxSize] = useState({ width: 1250, height: 1000 });

    // Timer for delayed drawing
    const drawTimer = useRef(null);
    // Track if drawing mode should be entered after 1s
    const [delayedDrawReady, setDelayedDrawReady] = useState(false);

    useEffect(() => {
        function handleResize() {
            const parent = canvasRef.current?.parentNode;
            if (parent) {
                const scale = parent.offsetWidth / (GRID_WIDTH * CELL_SIZE);
                setCanvasPxSize({
                    width: GRID_WIDTH * CELL_SIZE * scale,
                    height: GRID_HEIGHT * CELL_SIZE * scale,
                });
            }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const { width, height } = canvasPxSize;
        const ctx = canvasRef.current.getContext("2d");
        ctx.save();
        ctx.clearRect(0, 0, width, height);

        ctx.translate(offset.x, offset.y);
        ctx.scale(zoom, zoom);

        ctx.strokeStyle = "#555";
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= GRID_WIDTH; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
            ctx.stroke();
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE);
            ctx.stroke();
        }

        // Draw prop shapes in red
        for (const rect of propShapes) {
            drawRectOnGrid(ctx, rect.start, rect.end, CELL_SIZE, rect.color);
        }
        // Draw saved rectangles (green)
        for (const rect of drawnRects) {
            drawRectOnGrid(ctx, rect.start, rect.end, CELL_SIZE, rect.color);
        }
        // Draw current drag preview (green)
        if (drawing && startCell && endCell) {
            drawRectOnGrid(ctx, startCell, endCell, CELL_SIZE, "#31AF99");
        }
        ctx.restore();
    }, [canvasPxSize, drawnRects, drawing, startCell, endCell, zoom, offset]);

    function getCellFromMouse(event) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left - offset.x) / zoom;
        const y = (event.clientY - rect.top - offset.y) / zoom;
        return {
            x: Math.floor(x / CELL_SIZE),
            y: Math.floor(y / CELL_SIZE),
        };
    }

    function handleMouseDown(e) {
        e.preventDefault();
        if (e.button === 2) return; // Ignore right click

        setPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y });

        if (drawTimer.current) {
            clearTimeout(drawTimer.current);
        }
        setDelayedDrawReady(false);

        drawTimer.current = setTimeout(() => {
            setPanning(false);
            setDelayedDrawReady(true);
            const cell = getCellFromMouse(e);
            setDrawing(true);
            setStartCell(cell);
            setEndCell(cell);
            setMouseGridPos(cell);
        }, 1000);
    }

    function handleMouseMove(e) {
        e.preventDefault();
        const cell = getCellFromMouse(e);
        setMouseGridPos(cell);

        if (drawing) {
            setEndCell(cell);
        } else if (panning && panStart) {
            const dx = e.clientX - panStart.x;
            const dy = e.clientY - panStart.y;

            // If mouse moved significantly, cancel drawing timer
            if (drawTimer.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
                clearTimeout(drawTimer.current);
                drawTimer.current = null;
                setDelayedDrawReady(false);
            }

            setOffset({
                x: panStart.ox + dx,
                y: panStart.oy + dy,
            });
        }
    }

    function handleMouseUp(e) {
        e.preventDefault();
        if (drawTimer.current) {
            clearTimeout(drawTimer.current);
            drawTimer.current = null;
        }

        // If in drawing mode and released, finalize the shape
        if (drawing && startCell && endCell) {
            const newRect = { start: startCell, end: endCell, color: "#31AF99" };
            // Check overlap with both user-drawn and prop shapes
            if (
                rectOverlaps(newRect, drawnRects) ||
                rectOverlaps(newRect, propShapes)
            ) {
                toast.error("Overlapping shape detected!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    theme: "colored",
                });
            } else {
                setDrawnRects([...drawnRects, newRect]);
                const x1 = Math.min(startCell.x, endCell.x);
                const y1 = Math.min(startCell.y, endCell.y);
                const x2 = Math.max(startCell.x, endCell.x);
                const y2 = Math.max(startCell.y, endCell.y);
                setLastShapeCoords({
                    topleft: { x: x1, y: y1 },
                    bottomright: { x: x2, y: y2 }
                });
            }
        }

        setDrawing(false);
        setStartCell(null);
        setEndCell(null);
        setPanning(false);
        setPanStart(null);
        setDelayedDrawReady(false);
    }

    useEffect(() => {
        function handleWheel(e) {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.2 : 0.8;
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const wx = (mouseX - offset.x) / zoom;
            const wy = (mouseY - offset.y) / zoom;
            const newZoom = Math.max(0.25, Math.min(zoom * factor, 8));
            const newOffsetX = mouseX - wx * newZoom;
            const newOffsetY = mouseY - wy * newZoom;
            setZoom(newZoom);
            setOffset({ x: newOffsetX, y: newOffsetY });
        }
        canvasRef.current?.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            canvasRef.current?.removeEventListener("wheel", handleWheel, { passive: false });
        };
    }, [zoom, offset]);

    function handleContextMenu(e) {
        e.preventDefault();
    }

    return (
        <div style={{ width: "100%", maxWidth: "100vw", overflow: "hidden", touchAction: "none" }} className="rounded">
            <TopBar mouseGridPos={mouseGridPos} lastShapeCoords={lastShapeCoords} />
            <canvas
                ref={canvasRef}
                width={canvasPxSize.width}
                height={canvasPxSize.height}
                className="bg-dark-700 border border-border"
                style={{
                    width: "100%",
                    height: `${canvasPxSize.height}px`,
                    display: "block",
                    cursor: drawing
                        ? "crosshair"
                        : panning
                            ? "grab"
                            : "pointer",
                    userSelect: "none"
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onContextMenu={handleContextMenu}
            />
        </div>
    );
}
