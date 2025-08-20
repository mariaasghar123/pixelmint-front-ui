"use client";
import React, { useRef, useEffect, useState } from "react";
import TopBar from "./TopBar";
import { toast, ToastContainer } from "react-toastify";

// --- COLOR VARIABLES ---
const COLOR_BG_CANVAS = "#18312c";
const COLOR_GRID = "#555";
const COLOR_PROP_SHAPE = "#E44A4A";
const COLOR_DRAWN_SHAPE = "#31AF99";
const COLOR_DRAW_PREVIEW = "#31AF99";

// --- BLOCK/GRID SETTINGS ---
const shopverseImg = "/shopverse.png";
const BLOCK_SIZE = 10;
const GRID_WIDTH = 125;
const GRID_HEIGHT = 100;
const PIXEL_CANVAS_WIDTH = GRID_WIDTH * BLOCK_SIZE;
const PIXEL_CANVAS_HEIGHT = GRID_HEIGHT * BLOCK_SIZE;
const ZOOM_LEVEL = 2;

// --- PROP SHAPES (all have images, will show red when canDraw is true) ---
const propShapes = [
    { start: { x: 2, y: 2 }, end: { x: 5, y: 5 }, color: COLOR_PROP_SHAPE, image: shopverseImg },
    { start: { x: 10, y: 10 }, end: { x: 15, y: 14 }, color: COLOR_PROP_SHAPE, image: shopverseImg },
    { start: { x: 20, y: 20 }, end: { x: 30, y: 28 }, color: COLOR_PROP_SHAPE, image: shopverseImg }
];

function drawImageOnGrid(ctx, img, start, end, blockSize) {
    const x1 = Math.min(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const x2 = Math.max(start.x, end.x);
    const y2 = Math.max(start.y, end.y);
    const width = (x2 - x1 + 1) * blockSize;
    const height = (y2 - y1 + 1) * blockSize;
    ctx.drawImage(img, x1 * blockSize, y1 * blockSize, width, height);
}

function drawRectOnGrid(ctx, start, end, blockSize, color) {
    const x1 = Math.min(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const x2 = Math.max(start.x, end.x);
    const y2 = Math.max(start.y, end.y);
    ctx.fillStyle = color;
    ctx.fillRect(x1 * blockSize, y1 * blockSize, (x2 - x1 + 1) * blockSize, (y2 - y1 + 1) * blockSize);
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

export default function PixelGridCanvas4() {
    const canvasRef = useRef(null);

    const [panning, setPanning] = useState(false);
    const [panStart, setPanStart] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const [drawing, setDrawing] = useState(false);
    const [startBlock, setStartBlock] = useState(null);
    const [endBlock, setEndBlock] = useState(null);
    const [drawnRects, setDrawnRects] = useState([]);

    const [mousePixelPos, setMousePixelPos] = useState({ x: null, y: null });
    const [mouseGridPos, setMouseGridPos] = useState({ x: null, y: null });

    const [lastShapeCoords, setLastShapeCoords] = useState(null);

    const [canvasPxSize, setCanvasPxSize] = useState({
        width: PIXEL_CANVAS_WIDTH,
        height: PIXEL_CANVAS_HEIGHT,
        scale: 1,
    });

    const [zoomActive, setZoomActive] = useState(false);
    const [zoomedIn, setZoomedIn] = useState(false);
    const [zoom, setZoom] = useState(1);

    const [canDraw, setCanDraw] = useState(false);

    const [loadedImages, setLoadedImages] = useState({});

    useEffect(() => {
        function handleResize() {
            const parent = canvasRef.current?.parentNode;
            if (parent) {
                const maxWidth = parent.offsetWidth;
                const scale = maxWidth / PIXEL_CANVAS_WIDTH;
                setCanvasPxSize({
                    width: PIXEL_CANVAS_WIDTH * scale,
                    height: PIXEL_CANVAS_HEIGHT * scale,
                    scale: scale,
                });
            }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        propShapes.forEach((shape) => {
            if (shape.image && !loadedImages[shape.image]) {
                const img = new window.Image();
                img.src = shape.image;
                img.onload = () =>
                    setLoadedImages((images) => ({
                        ...images,
                        [shape.image]: img,
                    }));
            }
        });
    }, [loadedImages]);

    useEffect(() => {
        const { width, height, scale } = canvasPxSize;
        const ctx = canvasRef.current.getContext("2d");
        ctx.save();
        ctx.clearRect(0, 0, width, height);

        ctx.translate(offset.x, offset.y);
        ctx.scale(scale * zoom, scale * zoom);

        ctx.strokeStyle = COLOR_GRID;
        ctx.lineWidth = 0.8 / (scale * zoom);
        ctx.beginPath();
        for (let x = 0; x <= GRID_WIDTH; x++) {
            ctx.moveTo(x * BLOCK_SIZE, 0);
            ctx.lineTo(x * BLOCK_SIZE, PIXEL_CANVAS_HEIGHT);
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            ctx.moveTo(0, y * BLOCK_SIZE);
            ctx.lineTo(PIXEL_CANVAS_WIDTH, y * BLOCK_SIZE);
        }
        ctx.stroke();

        // Show red shapes when buying pixels, images otherwise
        for (const rect of propShapes) {
            if (canDraw) {
                drawRectOnGrid(ctx, rect.start, rect.end, BLOCK_SIZE, COLOR_PROP_SHAPE);
            } else if (rect.image && loadedImages[rect.image]) {
                drawImageOnGrid(ctx, loadedImages[rect.image], rect.start, rect.end, BLOCK_SIZE);
            } else {
                drawRectOnGrid(ctx, rect.start, rect.end, BLOCK_SIZE, COLOR_PROP_SHAPE);
            }
        }

        for (const rect of drawnRects) {
            drawRectOnGrid(ctx, rect.start, rect.end, BLOCK_SIZE, COLOR_DRAWN_SHAPE);
        }
        if (drawing && startBlock && endBlock) {
            drawRectOnGrid(ctx, startBlock, endBlock, BLOCK_SIZE, COLOR_DRAW_PREVIEW);
        }
        ctx.restore();
    }, [drawnRects, drawing, startBlock, endBlock, canvasPxSize, offset, zoom, loadedImages, canDraw]);

    function getPixelFromMouse(event) {
        const rect = canvasRef.current.getBoundingClientRect();
        const px = Math.floor((event.clientX - rect.left - offset.x) / (canvasPxSize.scale * zoom));
        const py = Math.floor((event.clientY - rect.top - offset.y) / (canvasPxSize.scale * zoom));
        return {
            x: Math.max(0, Math.min(px, PIXEL_CANVAS_WIDTH - 1)),
            y: Math.max(0, Math.min(py, PIXEL_CANVAS_HEIGHT - 1)),
        };
    }
    function getBlockFromMouse(event) {
        const pixelPos = getPixelFromMouse(event);
        return {
            x: Math.floor(pixelPos.x / BLOCK_SIZE),
            y: Math.floor(pixelPos.y / BLOCK_SIZE),
        };
    }

    function handleMouseDown(e) {
        e.preventDefault();
        if (e.button === 2) return;

        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            setPanning(true);
            setPanStart({
                x: e.clientX,
                y: e.clientY,
                ox: offset.x,
                oy: offset.y,
            });
            return;
        }

        if (zoomActive && !zoomedIn) {
            const pixel = getPixelFromMouse(e);
            const { scale } = canvasPxSize;
            const canvasW = PIXEL_CANVAS_WIDTH * scale;
            const canvasH = PIXEL_CANVAS_HEIGHT * scale;
            const centerX = pixel.x * scale * ZOOM_LEVEL;
            const centerY = pixel.y * scale * ZOOM_LEVEL;
            setZoom(ZOOM_LEVEL);
            setOffset({
                x: canvasW / 2 - centerX,
                y: canvasH / 2 - centerY,
            });
            setZoomedIn(true);
            setZoomActive(false);
            return;
        }

        if (!canDraw) return;

        const block = getBlockFromMouse(e);
        setDrawing(true);
        setStartBlock(block);
        setEndBlock(block);
        setMouseGridPos(block);
    }

    function handleMouseMove(e) {
        e.preventDefault();
        const pixel = getPixelFromMouse(e);
        setMousePixelPos(pixel);

        const block = getBlockFromMouse(e);
        setMouseGridPos(block);

        if (drawing) {
            setEndBlock(block);
        } else if (panning && panStart) {
            const dx = e.clientX - panStart.x;
            const dy = e.clientY - panStart.y;
            setOffset({
                x: panStart.ox + dx,
                y: panStart.oy + dy,
            });
        }
    }

    function handleMouseUp(e) {
        e.preventDefault();
        if (panning) {
            setPanning(false);
            setPanStart(null);
            return;
        }
        if (drawing && canDraw && startBlock && endBlock) {
            const newRect = { start: startBlock, end: endBlock, color: COLOR_DRAWN_SHAPE };
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
                const x1 = Math.min(startBlock.x, endBlock.x);
                const y1 = Math.min(startBlock.y, endBlock.y);
                const x2 = Math.max(startBlock.x, endBlock.x);
                const y2 = Math.max(startBlock.y, endBlock.y);
                setLastShapeCoords({
                    topleft: { x: x1, y: y1 },
                    bottomright: { x: x2, y: y2 },
                });
            }
        }

        setDrawing(false);
        setStartBlock(null);
        setEndBlock(null);
    }

    function handleZoomClick() {
        if (!zoomedIn) {
            setZoomActive((prev) => !prev);
        } else {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
            setZoomedIn(false);
            setZoomActive(false);
        }
    }

    function handleCanDrawToggle() {
        setCanDraw(prev => !prev);
        setDrawing(false);
        setStartBlock(null);
        setEndBlock(null);
    }

    function handleContextMenu(e) {
        e.preventDefault();
    }

    return (
        <div style={{ width: "100%", maxWidth: "100vw", overflow: "hidden", touchAction: "none" }} className="rounded">
            <ToastContainer />
            <TopBar
                mousePixelPos={mousePixelPos}
                lastShapeCoords={lastShapeCoords}
                zoomActive={zoomActive}
                onZoomClick={handleZoomClick}
                zoomedIn={zoomedIn}
                canDraw={canDraw}
                onCanDrawToggle={handleCanDrawToggle}
            />
            <canvas
                ref={canvasRef}
                width={canvasPxSize.width}
                height={canvasPxSize.height}
                className="bg-dark-700 border border-border"
                style={{
                    width: "100%",
                    height: `${canvasPxSize.height}px`,
                    display: "block",
                    cursor: zoomActive
                        ? "zoom-in"
                        : panning
                            ? "grab"
                            : (drawing && canDraw)
                                ? "crosshair"
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
