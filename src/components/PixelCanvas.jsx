"use client";
import React, { useRef, useEffect, useState } from "react";
import TopBar from "./TopBar";
import { useToggleFullscreen } from "@/hooks/useFullscreen";
import { toast } from "react-toastify";
import ReservePixelsModal from "./ReservePixelsModal";
import ReservedShapePopover from "./ReservedShapePopover";
import CompleteTransactionModal from "./CompleteTransactionModal";
import { saveReservation, getReservation, clearReservation } from "@/utils/localStorage.utils";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const COLOR_GRID = "#555";
const COLOR_PROP_SHAPE = "#E44A4A";
const COLOR_DRAW_PREVIEW = "#31AF99";
const COLOR_RESERVATION = "#3b82f6";
const BorderWidth = 2;
const shopverseImg = "/shopverse.png";
const BLOCK_SIZE = 10;
const GRID_WIDTH = 125;
const GRID_HEIGHT = 100;
const PIXEL_CANVAS_WIDTH = GRID_WIDTH * BLOCK_SIZE;
const PIXEL_CANVAS_HEIGHT = GRID_HEIGHT * BLOCK_SIZE;
const ZOOM_LEVEL = 2;

function formatCoordsArr(coordArr) {
    return [Math.floor(coordArr[0] / BLOCK_SIZE), Math.floor(coordArr[1] / BLOCK_SIZE)];
}

function blockToPixelCoords(blockArr) {
    return [blockArr[0] * BLOCK_SIZE, blockArr[1] * BLOCK_SIZE];
}

const propShapes = [
    { topLeft: [50, 40], bottomRight: [80, 60], color: COLOR_PROP_SHAPE, image: shopverseImg },
    { topLeft: [15, 5], bottomRight: [30, 14], color: COLOR_PROP_SHAPE, image: shopverseImg },
    { topLeft: [40, 20], bottomRight: [60, 28], color: COLOR_PROP_SHAPE, image: shopverseImg }
];

async function postReservation(reservationId, pixelArea) {
    try {
        await api.post('pixel/reserve', {
            reservationId,
            pixelArea
        });
    } catch (err) {
        toast.error("Failed to reserve pixels.");
        throw err;
    }
}

async function deleteReservation(reservationId) {
    try {
        await api.delete(`pixel/reservations/${reservationId}`);
    } catch (err) {
        toast.error("Failed to cancel reservation.");
    }
}

function rectOverlaps(rect, rects) {
    const [x1, y1] = rect.topLeft;
    const [x2, y2] = rect.bottomRight;

    for (const r of rects) {
        let rTopLeft, rBottomRight;
        if (r.pixelArea) {
            rTopLeft = formatCoordsArr(r.pixelArea.topLeft);
            rBottomRight = formatCoordsArr(r.pixelArea.bottomRight);
        } else if (r.topLeft && r.bottomRight) {
            rTopLeft = r.topLeft;
            rBottomRight = r.bottomRight;
        } else {
            continue;
        }
        const [rx1, ry1] = rTopLeft;
        const [rx2, ry2] = rBottomRight;

        if (!(x2 < rx1 || x1 > rx2 || y2 < ry1 || y1 > ry2)) {
            return true;
        }
    }
    return false;
}

export default function PixelGridCanvas() {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const router = useRouter();
    const [panning, setPanning] = useState(false);
    const [panStart, setPanStart] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [drawing, setDrawing] = useState(false);
    const [startBlock, setStartBlock] = useState(null);
    const [endBlock, setEndBlock] = useState(null);
    const [mousePixelPos, setMousePixelPos] = useState({ x: null, y: null });
    const [lastShapeCoords, setLastShapeCoords] = useState(null);
    const [zoomActive, setZoomActive] = useState(false);
    const [zoomedIn, setZoomedIn] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [canDraw, setCanDraw] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const [canvasPxSize, setCanvasPxSize] = useState({
        width: PIXEL_CANVAS_WIDTH,
        height: PIXEL_CANVAS_HEIGHT,
        scale: 1,
    });
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [modalCoords, setModalCoords] = useState(null);
    const [showReservedPopover, setShowReservedPopover] = useState(false);
    const [isFullscreen, toggleFullscreen] = useToggleFullscreen(canvasContainerRef);
    const { user: isAuthenticated } = useAuth();
    const [activeReservation, setActiveReservation] = useState(() => {
        const reservations = getReservation();
        return reservations?.length > 0 ? reservations[0] : null;
    });
    const [allReservations, setAllReservations] = useState([]);
    const [activeReservationId, setActiveReservationId] = useState(() => {
        const reservations = getReservation();
        return reservations?.length > 0 ? reservations[0]?.reservationId : null;
    });

    useEffect(() => {
        const reservations = getReservation();
        setActiveReservation(reservations ? reservations : null);
        setActiveReservationId(reservations ? reservations?.reservationId : null);
        if (reservations && drawing) {
            const coords = {
                topLeft: reservations.topLeft,
                bottomRight: (reservations.bottomRight)
            }
            setModalCoords(coords);
            setShowReservedPopover(true);
        }
    }, [drawing]);

    useEffect(() => {
        const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pixel/reservation-stream`;
        const eventSource = new EventSource(streamUrl);
        eventSource.onmessage = ({ data }) => {
            try {
                const parsed = JSON.parse(data);
                setAllReservations(prev => [...prev, ...parsed]);
            } catch (err) { }
        };
        eventSource.onerror = () => {
            eventSource.close();
        };
        return () => eventSource.close();
    }, []);

    useEffect(() => {
        async function fetchReservations() {
            try {
                const res = await api.get('pixel/reservations');
                setAllReservations(res.data.payload || []);
            } catch (err) {
                console.error("Failed to fetch reservations", err);
            }
        }
        fetchReservations();
    }, []);

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

        for (const rect of propShapes) {
            if (canDraw) {
                drawRectOnGrid(ctx, rect.topLeft, rect.bottomRight, BLOCK_SIZE, COLOR_PROP_SHAPE);
                allReservations.forEach(reservation => {
                    if (reservation.reservationId == activeReservationId)
                        return;

                    // block coordinates for drawing
                    const start = formatCoordsArr(reservation?.pixelArea?.topLeft || [0, 0]);
                    const end = formatCoordsArr(reservation?.pixelArea?.bottomRight || [0, 0]);
                    drawRectOnGrid(ctx, start, end, BLOCK_SIZE, COLOR_RESERVATION);
                });
            } else if (rect.image && loadedImages[rect.image]) {
                drawImageOnGrid(ctx, rect.topLeft, rect.bottomRight, BLOCK_SIZE, loadedImages[rect.image]);
            } else {
                drawRectOnGrid(ctx, rect.topLeft, rect.bottomRight, BLOCK_SIZE, COLOR_PROP_SHAPE);
            }
        }

        if (activeReservation) {
            // block coordinates for drawing
            const start = formatCoordsArr(activeReservation.topLeft);
            const end = formatCoordsArr(activeReservation.bottomRight);
            drawRectOnGrid(ctx, start, end, BLOCK_SIZE, COLOR_DRAW_PREVIEW);
        }

        if (drawing && startBlock && endBlock) {
            drawRectOnGrid(ctx, startBlock, endBlock, BLOCK_SIZE, COLOR_DRAW_PREVIEW);
        }
        ctx.restore();
    }, [drawing, startBlock, endBlock, canvasPxSize, offset, zoom, loadedImages, canDraw, allReservations, activeReservation]);

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
    }, [isFullscreen]);

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
        return [
            Math.floor(pixelPos.x / BLOCK_SIZE),
            Math.floor(pixelPos.y / BLOCK_SIZE)
        ];
    }

    function handleMouseDown(e) {
        e.preventDefault();
        if (e.button === 2) return;
        if (activeReservation) {
            toast.error("Cancel or continue transaction before reserving another.");
            return;
        }
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
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left - offset.x) / (canvasPxSize.scale * zoom);
            const mouseY = (e.clientY - rect.top - offset.y) / (canvasPxSize.scale * zoom);
            const { scale } = canvasPxSize;
            const zoomLevel = ZOOM_LEVEL;
            const canvasW = PIXEL_CANVAS_WIDTH * scale;
            const canvasH = PIXEL_CANVAS_HEIGHT * scale;
            const centerX = mouseX * scale * zoomLevel;
            const centerY = mouseY * scale * zoomLevel;
            const newOffset = {
                x: (canvasW / 2) - centerX,
                y: (canvasH / 2) - centerY,
            };
            setZoom(zoomLevel);
            setOffset(newOffset);
            setZoomedIn(true);
            setZoomActive(false);
            return;
        }
        if (!canDraw) return;
        const pixelPos = getPixelFromMouse(e);
        setMousePixelPos(pixelPos);
        const block = getBlockFromMouse(e);
        setDrawing(true);
        setStartBlock(block);
        setEndBlock(block);
    }

    function handleMouseMove(e) {
        e.preventDefault();
        const pixel = getPixelFromMouse(e);
        setMousePixelPos(pixel);
        const block = getBlockFromMouse(e);
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

    async function handleMouseUp(e) {
        e.preventDefault();
        if (panning) {
            setPanning(false);
            setPanStart(null);
            return;
        }
        if (drawing && canDraw && startBlock && endBlock) {
            // Always store and check shapes in block coordinates
            const x1 = Math.min(startBlock[0], endBlock[0]);
            const y1 = Math.min(startBlock[1], endBlock[1]);
            const x2 = Math.max(startBlock[0], endBlock[0]);
            const y2 = Math.max(startBlock[1], endBlock[1]);
            const blockCoords = {
                topLeft: [x1, y1],
                bottomRight: [x2, y2]
            };

            if (rectOverlaps(blockCoords, allReservations) || rectOverlaps(blockCoords, propShapes)) {
                toast.error("Cannot reserve overlapping pixels. Please select a free area.");
                setDrawing(false);
                setStartBlock(null);
                setEndBlock(null);
                return;
            }

            // Convert block coordinates to pixel coordinates for API, modal, drawing
            const pxTopLeft = blockToPixelCoords(blockCoords.topLeft);
            const pxBottomRight = [
                (blockCoords.bottomRight[0] + 1) * BLOCK_SIZE - 1,
                (blockCoords.bottomRight[1] + 1) * BLOCK_SIZE - 1
            ];
            const coords = {
                topLeft: pxTopLeft,
                bottomRight: pxBottomRight
            };

            setLastShapeCoords(coords);
            setModalCoords(coords);
            setShowReserveModal(true);
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
        setDrawing(p => !p);
        if (activeReservation)
            setShowReservedPopover(p => !p)
        setStartBlock(null);
        setEndBlock(null);
    }

    function handleContextMenu(e) {
        e.preventDefault();
    }

    async function handleReserveModalConfirmed() {
        setShowReserveModal(false);
        setShowReservedPopover(true);
        const coords = modalCoords;
        const reservationId = String(Date.now()) + "-" + Math.floor(Math.random() * 1000000);
        try {
            await postReservation(reservationId, coords);
            saveReservation({ ...coords, reservationId });
            setActiveReservation({ ...coords, reservationId });
            setActiveReservationId(reservationId);
        } catch (err) { }
    }

    async function handleCancelTransaction() {
        setShowReservedPopover(false);
        if (activeReservationId) {
            await deleteReservation(activeReservationId);
        }
        clearReservation();
        setActiveReservation(null);
        setActiveReservationId(null);
    }

    function handleContinueTransaction() {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        setShowReservedPopover(false);
        setShowCompleteModal(true);
    }

    function handleCompleteModalClose() {
        setShowCompleteModal(false);
        clearReservation();
        setActiveReservation(null);
        setActiveReservationId(null);
    }

    function handleReserveModalClose() {
        setShowReserveModal(false);
        clearReservation();
        setActiveReservation(null);
        setActiveReservationId(null);
    }

    return (
        <div ref={canvasContainerRef} style={{ width: "100%", maxWidth: "100vw", overflow: "hidden", touchAction: "none" }} className="rounded relative">
            <TopBar
                isExpanded={isFullscreen}
                expandClick={toggleFullscreen}
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
            <ReservedShapePopover
                coords={modalCoords}
                open={showReservedPopover}
                onCancel={handleCancelTransaction}
                onContinue={handleContinueTransaction}
            />
            <ReservePixelsModal
                open={showReserveModal}
                onClose={handleReserveModalClose}
                coords={modalCoords}
                onConfirmed={handleReserveModalConfirmed}
            />
            <CompleteTransactionModal
                open={showCompleteModal}
                onClose={handleCompleteModalClose}
            />
        </div>
    );
}

function drawImageOnGrid(ctx, topLeft, bottomRight, blockSize, img) {
    const x1 = Math.min(topLeft[0], bottomRight[0]);
    const y1 = Math.min(topLeft[1], bottomRight[1]);
    const x2 = Math.max(topLeft[0], bottomRight[0]);
    const y2 = Math.max(topLeft[1], bottomRight[1]);
    const width = (x2 - x1 + 1) * blockSize;
    const height = (y2 - y1 + 1) * blockSize;
    ctx.drawImage(img, x1 * blockSize, y1 * blockSize, width, height);
}

// Accepts block coordinates for drawing
function drawRectOnGrid(ctx, topLeft, bottomRight, blockSize, color) {
    const x1 = Math.min(topLeft[0], bottomRight[0]);
    const y1 = Math.min(topLeft[1], bottomRight[1]);
    const x2 = Math.max(topLeft[0], bottomRight[0]);
    const y2 = Math.max(topLeft[1], bottomRight[1]);
    const px = x1 * blockSize;
    const py = y1 * blockSize;
    const width = (x2 - x1 + 1) * blockSize;
    const height = (y2 - y1 + 1) * blockSize;

    ctx.fillStyle = `${color}33`;
    ctx.fillRect(px, py, width, height);

    ctx.lineWidth = BorderWidth;
    ctx.strokeStyle = color;
    ctx.strokeRect(px, py, width, height);
}
