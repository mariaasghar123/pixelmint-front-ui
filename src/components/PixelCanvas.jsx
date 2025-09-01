"use client"
import { useRef, useEffect, useState } from "react"
import TopBar from "./TopBar"
import { useToggleFullscreen } from "@/hooks/useFullscreen"
import { toast } from "react-toastify"
import ReservePixelsModal from "./ReservePixelsModal"
import ReservedShapePopover from "./ReservedShapePopover"
import CompleteTransactionModal from "./CompleteTransactionModal"
import { saveReservation, getReservation, clearReservation } from "@/utils/localStorage.utils"
import { useAuth } from "./AuthProvider"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"

const COLOR_GRID = "#FFFFFF2A"
const COLOR_PROP_SHAPE = "#E44A4A"
const COLOR_DRAW_PREVIEW = "#31AF99"
const COLOR_RESERVATION = "#3b82f6"
const BorderWidth = 2
const shopverseImg = "/shopverse.png"
const TOTAL_WIDTH = 1250
const TOTAL_HEIGHT = 750
const BLOCK_SIZE = 5
const GRID_WIDTH = TOTAL_WIDTH / BLOCK_SIZE
const GRID_HEIGHT = TOTAL_HEIGHT / BLOCK_SIZE
const PIXEL_CANVAS_WIDTH = GRID_WIDTH * BLOCK_SIZE
const PIXEL_CANVAS_HEIGHT = GRID_HEIGHT * BLOCK_SIZE
const MIN_ZOOM = 0.1
const MAX_ZOOM = 20 // Increased for high precision zoom
const ZOOM_FACTOR = 0.1

// Magnifying glass settings
const MAGNIFIER_SIZE = 200 // Diameter of magnifier
const MAGNIFIER_ZOOM = 8 // Initial magnification level
const MIN_MAGNIFIER_ZOOM = 2
const MAX_MAGNIFIER_ZOOM = 20

// Click-to-zoom settings
const CLICK_ZOOM_LEVELS = [5, 10, 15, 20] // High precision zoom levels
const CLICK_ZOOM_FACTOR = 0.8 // How much of the screen should the zoomed area occupy

function formatCoordsArr(coordArr) {
    return [Math.floor(coordArr[0] / BLOCK_SIZE), Math.floor(coordArr[1] / BLOCK_SIZE)]
}

function blockToPixelCoords(blockArr) {
    return [blockArr[0] * BLOCK_SIZE + 1, blockArr[1] * BLOCK_SIZE + 1]
}

const propShapes = [
    { topLeft: [50, 40], bottomRight: [80, 60], color: COLOR_PROP_SHAPE, image: shopverseImg },
    { topLeft: [15, 5], bottomRight: [30, 14], color: COLOR_PROP_SHAPE, image: shopverseImg },
    { topLeft: [40, 20], bottomRight: [60, 28], color: COLOR_PROP_SHAPE, image: shopverseImg },
]

async function postReservation(reservationId, pixelArea) {
    try {
        await api.post("pixel/reserve", {
            reservationId,
            pixelArea,
        })
    } catch (err) {
        toast.error("Failed to reserve pixels.")
        throw err
    }
}

async function deleteReservation(reservationId) {
    try {
        await api.delete(`pixel/reservations/${reservationId}`)
    } catch (err) {
        toast.error("Failed to cancel reservation.")
    }
}

function rectOverlaps(rect, rects) {
    const [x1, y1] = rect.topLeft
    const [x2, y2] = rect.bottomRight

    for (const r of rects) {
        let rTopLeft, rBottomRight
        if (r.pixelArea) {
            rTopLeft = formatCoordsArr(r.pixelArea.topLeft)
            rBottomRight = formatCoordsArr(r.pixelArea.bottomRight)
        } else if (r.topLeft && r.bottomRight) {
            rTopLeft = r.topLeft
            rBottomRight = r.bottomRight
        } else {
            continue
        }
        const [rx1, ry1] = rTopLeft
        const [rx2, ry2] = rBottomRight

        if (!(x2 < rx1 || x1 > rx2 || y2 < ry1 || y1 > ry2)) {
            return true
        }
    }
    return false
}

// Helper function to detect if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window && window.innerWidth <= 1024);
}

export default function PixelGridCanvas() {
    const canvasRef = useRef(null)
    const magnifierCanvasRef = useRef(null) // Hidden canvas for magnifier source
    const canvasContainerRef = useRef(null)
    const router = useRouter()
    const [panning, setPanning] = useState(false)
    const [panStart, setPanStart] = useState(null)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [drawing, setDrawing] = useState(false)
    const [startBlock, setStartBlock] = useState(null)
    const [endBlock, setEndBlock] = useState(null)
    const [mousePixelPos, setMousePixelPos] = useState({ x: null, y: null })
    const [lastShapeCoords, setLastShapeCoords] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [canDraw, setCanDraw] = useState(false)
    const [loadedImages, setLoadedImages] = useState({})
    const [canvasScale, setCanvasScale] = useState(1)
    const [showReserveModal, setShowReserveModal] = useState(false)
    const [showCompleteModal, setShowCompleteModal] = useState(false)
    const [modalCoords, setModalCoords] = useState(null)
    const [showReservedPopover, setShowReservedPopover] = useState(false)
    const [isFullscreen, toggleFullscreen] = useToggleFullscreen(canvasContainerRef)
    const { user: isAuthenticated } = useAuth()

    // Magnifying glass states
    const [magnifierActive, setMagnifierActive] = useState(false)
    const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 })
    const [magnifierZoom, setMagnifierZoom] = useState(MAGNIFIER_ZOOM)
    const [isMobile, setIsMobile] = useState(false)
    const [clickZoomLevel, setClickZoomLevel] = useState(0) // Track current click zoom level

    const [activeReservation, setActiveReservation] = useState(() => {
        const reservations = getReservation()
        return reservations?.length > 0 ? reservations[0] : null
    })
    const [allReservations, setAllReservations] = useState([])
    const [activeReservationId, setActiveReservationId] = useState(() => {
        const reservations = getReservation()
        return reservations?.length > 0 ? reservations[0]?.reservationId : null
    })

    // Touch gesture states
    const [lastTouches, setLastTouches] = useState([])
    const [initialPinchDistance, setInitialPinchDistance] = useState(0)
    const [initialZoom, setInitialZoom] = useState(1)
    const [touchDrawing, setTouchDrawing] = useState(false)

    const queryClient = useQueryClient()

    // Detect if device is mobile on mount
    useEffect(() => {
        setIsMobile(isMobileDevice())
    }, [])

    useEffect(() => {
        const reservations = getReservation()
        setActiveReservation(reservations ? reservations : null)
        setActiveReservationId(reservations ? reservations?.reservationId : null)
        if (reservations && drawing) {
            const coords = {
                topLeft: reservations.topLeft,
                bottomRight: reservations.bottomRight,
            }
            setModalCoords(coords)
            setShowReservedPopover(true)
        }
    }, [drawing])

    async function fetchReservations() {
        try {
            const res = await api.get("pixel/reservations")
            setAllReservations(res.data.payload || [])
        } catch (err) {
            console.error("Failed to fetch reservations", err)
        }
    }

    useEffect(() => {
        const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pixel/purchase-stream`
        const eventSource = new EventSource(streamUrl)
        eventSource.onmessage = () => {
            try {
                fetchReservations()
                queryClient.invalidateQueries(["/pixel/purchases"])
            } catch (err) { }
        }
        eventSource.onerror = () => {
            eventSource.close()
        }
        return () => eventSource.close()
    }, [])

    useEffect(() => {
        const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pixel/reservation-stream`
        const eventSource = new EventSource(streamUrl)
        eventSource.onmessage = ({ data }) => {
            try {
                const parsed = JSON.parse(data)
                setAllReservations((prev) => [...prev, ...parsed])
            } catch (err) { }
        }
        eventSource.onerror = () => {
            eventSource.close()
        }
        return () => eventSource.close()
    }, [])

    const { data: purchases } = useQuery({
        queryKey: ["/pixel/purchases"],
        queryFn: async () => {
            try {
                const data = await api.get("/pixel/purchases")
                return data.data.payload?.pixel
            } catch (err) {
                console.error("Error fetching purchases:", err)
            }
        },
    })

    useEffect(() => {
        fetchReservations()
    }, [])

    // Responsive scaling (only affects CSS size, not canvas pixel size)
    useEffect(() => {
        function handleResize() {
            const parent = canvasRef.current?.parentNode
            if (parent) {
                const maxWidth = Math.min(parent.offsetWidth, window.innerWidth)
                const maxHeight = window.innerHeight - 120 // Account for TopBar and some padding

                // Calculate scale based on both width and height constraints
                const scaleByWidth = maxWidth / PIXEL_CANVAS_WIDTH
                const scaleByHeight = maxHeight / PIXEL_CANVAS_HEIGHT
                const scale = Math.min(scaleByWidth, scaleByHeight, 1) // Don't scale up beyond original size

                setCanvasScale(scale)
            }
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        purchases?.forEach((shape) => {
            if (shape?.adImageUrl && !loadedImages[shape.adImageUrl]) {
                const img = new window.Image()
                img.src = shape?.adImageUrl
                img.onload = () =>
                    setLoadedImages((images) => ({
                        ...images,
                        [shape?.adImageUrl]: img,
                    }))
            }
        })
    }, [purchases, loadedImages])

    // Draw the main canvas
    function drawMainCanvas() {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        ctx.save()
        ctx.clearRect(0, 0, PIXEL_CANVAS_WIDTH, PIXEL_CANVAS_HEIGHT)

        ctx.translate(offset.x, offset.y)
        ctx.scale(zoom, zoom)

        ctx.strokeStyle = COLOR_GRID
        ctx.lineWidth = 0.8 / zoom
        ctx.beginPath()
        for (let x = 0; x <= GRID_WIDTH; x++) {
            ctx.moveTo(x * BLOCK_SIZE, 0)
            ctx.lineTo(x * BLOCK_SIZE, PIXEL_CANVAS_HEIGHT)
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            ctx.moveTo(0, y * BLOCK_SIZE)
            ctx.lineTo(PIXEL_CANVAS_WIDTH, y * BLOCK_SIZE)
        }
        ctx.stroke()

        if (purchases)
            for (const rect of purchases) {
                if (canDraw) {
                    drawRectOnGrid(
                        ctx,
                        formatCoordsArr(rect.pixelArea.topLeft),
                        formatCoordsArr(rect.pixelArea.bottomRight),
                        BLOCK_SIZE,
                        isAuthenticated?.user?.userId === rect.userId ? COLOR_DRAW_PREVIEW : COLOR_PROP_SHAPE,
                    )
                } else if (rect?.adImageUrl && loadedImages[rect?.adImageUrl]) {
                    drawImageOnGrid(
                        ctx,
                        formatCoordsArr(rect.pixelArea.topLeft),
                        formatCoordsArr(rect.pixelArea.bottomRight),
                        BLOCK_SIZE,
                        loadedImages[rect.adImageUrl],
                    )
                } else {
                    drawRectOnGrid(
                        ctx,
                        formatCoordsArr(rect.pixelArea.topLeft),
                        formatCoordsArr(rect.pixelArea.bottomRight),
                        BLOCK_SIZE,
                        isAuthenticated?.user?.userId === rect.userId ? COLOR_DRAW_PREVIEW : COLOR_PROP_SHAPE,
                    )
                }
            }

        if (canDraw) {
            allReservations.forEach((reservation) => {
                if (reservation.reservationId == activeReservationId) return

                const start = formatCoordsArr(reservation?.pixelArea?.topLeft || [0, 0])
                const end = formatCoordsArr(reservation?.pixelArea?.bottomRight || [0, 0])
                drawRectOnGrid(ctx, start, end, BLOCK_SIZE, COLOR_RESERVATION)
            })
        }

        if (activeReservation) {
            // block coordinates for drawing
            const start = formatCoordsArr(activeReservation.topLeft)
            const end = formatCoordsArr(activeReservation.bottomRight)
            drawRectOnGrid(ctx, start, end, BLOCK_SIZE, COLOR_DRAW_PREVIEW)
        }

        if (drawing && startBlock && endBlock) {
            drawRectOnGrid(ctx, startBlock, endBlock, BLOCK_SIZE, COLOR_DRAW_PREVIEW)
        }
        ctx.restore()

        // Draw magnifier if active
        if (magnifierActive) {
            drawMagnifier(ctx)
        }
    }

    // Draw the magnifying glass
    function drawMagnifier(mainCtx) {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()

        // Calculate actual canvas coordinates from screen coordinates
        const canvasX = (magnifierPos.x - rect.left) * (canvas.width / rect.width)
        const canvasY = (magnifierPos.y - rect.top) * (canvas.height / rect.height)

        // Calculate the source position in the original canvas coordinate system
        const sourceX = (canvasX - offset.x) / zoom
        const sourceY = (canvasY - offset.y) / zoom

        // Size of the area to capture (smaller area = higher zoom)
        const captureSize = MAGNIFIER_SIZE / magnifierZoom

        // Calculate bounds
        const sourceLeft = sourceX - captureSize / 2
        const sourceTop = sourceY - captureSize / 2

        // Create a temporary canvas to draw the magnified content
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = MAGNIFIER_SIZE
        tempCanvas.height = MAGNIFIER_SIZE
        const tempCtx = tempCanvas.getContext('2d')

        // Draw the magnified portion
        tempCtx.save()
        tempCtx.beginPath()
        tempCtx.arc(MAGNIFIER_SIZE / 2, MAGNIFIER_SIZE / 2, MAGNIFIER_SIZE / 2, 0, Math.PI * 2)
        tempCtx.clip()

        // Fill background
        tempCtx.fillStyle = '#0a0a0a'
        tempCtx.fillRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE)

        // Scale and translate to show the magnified area
        tempCtx.scale(magnifierZoom, magnifierZoom)
        tempCtx.translate(-sourceLeft, -sourceTop)

        // Draw grid
        tempCtx.strokeStyle = COLOR_GRID
        tempCtx.lineWidth = 0.8
        tempCtx.beginPath()
        for (let x = 0; x <= GRID_WIDTH; x++) {
            tempCtx.moveTo(x * BLOCK_SIZE, 0)
            tempCtx.lineTo(x * BLOCK_SIZE, PIXEL_CANVAS_HEIGHT)
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            tempCtx.moveTo(0, y * BLOCK_SIZE)
            tempCtx.lineTo(PIXEL_CANVAS_WIDTH, y * BLOCK_SIZE)
        }
        tempCtx.stroke()

        // Draw content
        if (purchases) {
            for (const rect of purchases) {
                if (canDraw) {
                    drawRectOnGrid(
                        tempCtx,
                        formatCoordsArr(rect.pixelArea.topLeft),
                        formatCoordsArr(rect.pixelArea.bottomRight),
                        BLOCK_SIZE,
                        isAuthenticated?.user?.userId === rect.userId ? COLOR_DRAW_PREVIEW : COLOR_PROP_SHAPE,
                    )
                } else if (rect?.adImageUrl && loadedImages[rect?.adImageUrl]) {
                    drawImageOnGrid(
                        tempCtx,
                        formatCoordsArr(rect.pixelArea.topLeft),
                        formatCoordsArr(rect.pixelArea.bottomRight),
                        BLOCK_SIZE,
                        loadedImages[rect.adImageUrl],
                    )
                } else {
                    drawRectOnGrid(
                        tempCtx,
                        formatCoordsArr(rect.pixelArea.topLeft),
                        formatCoordsArr(rect.pixelArea.bottomRight),
                        BLOCK_SIZE,
                        isAuthenticated?.user?.userId === rect.userId ? COLOR_DRAW_PREVIEW : COLOR_PROP_SHAPE,
                    )
                }
            }
        }

        // Draw reservations and active elements
        if (canDraw) {
            allReservations.forEach((reservation) => {
                if (reservation.reservationId == activeReservationId) return
                const start = formatCoordsArr(reservation?.pixelArea?.topLeft || [0, 0])
                const end = formatCoordsArr(reservation?.pixelArea?.bottomRight || [0, 0])
                drawRectOnGrid(tempCtx, start, end, BLOCK_SIZE, COLOR_RESERVATION)
            })
        }

        if (activeReservation) {
            const start = formatCoordsArr(activeReservation.topLeft)
            const end = formatCoordsArr(activeReservation.bottomRight)
            drawRectOnGrid(tempCtx, start, end, BLOCK_SIZE, COLOR_DRAW_PREVIEW)
        }

        if (drawing && startBlock && endBlock) {
            drawRectOnGrid(tempCtx, startBlock, endBlock, BLOCK_SIZE, COLOR_DRAW_PREVIEW)
        }

        tempCtx.restore()

        // Draw the magnifier circle on the main canvas
        mainCtx.save()
        mainCtx.resetTransform()

        // Position the magnifier
        let magnifierX = canvasX
        let magnifierY = canvasY

        // Keep magnifier within canvas bounds
        magnifierX = Math.max(MAGNIFIER_SIZE / 2, Math.min(canvas.width - MAGNIFIER_SIZE / 2, magnifierX))
        magnifierY = Math.max(MAGNIFIER_SIZE / 2, Math.min(canvas.height - MAGNIFIER_SIZE / 2, magnifierY))

        // Draw the magnified content
        mainCtx.drawImage(
            tempCanvas,
            magnifierX - MAGNIFIER_SIZE / 2,
            magnifierY - MAGNIFIER_SIZE / 2
        )

        // Draw border
        mainCtx.beginPath()
        mainCtx.arc(magnifierX, magnifierY, MAGNIFIER_SIZE / 2, 0, Math.PI * 2)
        mainCtx.strokeStyle = '#fff'
        mainCtx.lineWidth = 3
        mainCtx.stroke()

        // Draw outer shadow
        mainCtx.beginPath()
        mainCtx.arc(magnifierX, magnifierY, MAGNIFIER_SIZE / 2 + 2, 0, Math.PI * 2)
        mainCtx.strokeStyle = 'rgba(0,0,0,0.5)'
        mainCtx.lineWidth = 1
        mainCtx.stroke()

        // Draw crosshair at center
        mainCtx.strokeStyle = '#ff0000'
        mainCtx.lineWidth = 1
        mainCtx.beginPath()
        // Horizontal line
        mainCtx.moveTo(magnifierX - 10, magnifierY)
        mainCtx.lineTo(magnifierX + 10, magnifierY)
        // Vertical line
        mainCtx.moveTo(magnifierX, magnifierY - 10)
        mainCtx.lineTo(magnifierX, magnifierY + 10)
        mainCtx.stroke()

        mainCtx.restore()
    }

    // Zoom into clicked spot with high precision
    function zoomToClickPoint(e) {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()

        // Get the exact click position in canvas coordinates
        const canvasX = (e.clientX - rect.left) * (canvas.width / rect.width)
        const canvasY = (e.clientY - rect.top) * (canvas.height / rect.height)

        // Convert to world coordinates (accounting for current zoom and pan)
        const worldX = (canvasX - offset.x) / zoom
        const worldY = (canvasY - offset.y) / zoom

        // Get the next zoom level
        let targetZoom
        if (clickZoomLevel < CLICK_ZOOM_LEVELS.length) {
            targetZoom = CLICK_ZOOM_LEVELS[clickZoomLevel]
            setClickZoomLevel(clickZoomLevel + 1)
        } else {
            // Reset to normal view
            targetZoom = 1
            setClickZoomLevel(0)
        }

        // Calculate the canvas center
        const canvasCenterX = canvas.width / 2
        const canvasCenterY = canvas.height / 2

        // Calculate new offset to center the clicked point
        const newOffsetX = canvasCenterX - worldX * targetZoom
        const newOffsetY = canvasCenterY - worldY * targetZoom

        // Apply the zoom and pan
        setZoom(targetZoom)
        setOffset({ x: newOffsetX, y: newOffsetY })

        // Show a brief indicator of the zoom level
        if (targetZoom > 1) {
            toast.success(`Zoomed to ${targetZoom}x`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
            })
        } else {
            toast.info("Reset to normal view", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
            })
        }
    }

    // Main drawing effect
    useEffect(() => {
        drawMainCanvas()
    }, [
        drawing,
        startBlock,
        endBlock,
        offset,
        zoom,
        loadedImages,
        canDraw,
        allReservations,
        activeReservation,
        purchases,
        magnifierActive,
        magnifierPos,
        magnifierZoom,
    ])

    useEffect(() => {
        function handleResize() {
            const parent = canvasRef.current?.parentNode
            if (parent) {
                const maxWidth = Math.min(parent.offsetWidth, window.innerWidth)
                const maxHeight = window.innerHeight - 120
                const scaleByWidth = maxWidth / PIXEL_CANVAS_WIDTH
                const scaleByHeight = maxHeight / PIXEL_CANVAS_HEIGHT
                const scale = Math.min(scaleByWidth, scaleByHeight, 1)
                setCanvasScale(scale)
            }
        }
        handleResize()
    }, [isFullscreen])

    function getPixelFromEvent(event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Handle both mouse and touch events
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        // Map event to actual canvas pixel
        const x = ((clientX - rect.left) * scaleX - offset.x) / zoom;
        const y = ((clientY - rect.top) * scaleY - offset.y) / zoom;
        return {
            x: Math.max(0, Math.min(Math.floor(x), PIXEL_CANVAS_WIDTH - 1)),
            y: Math.max(0, Math.min(Math.floor(y), PIXEL_CANVAS_HEIGHT - 1)),
        };
    }

    function getPixelFromMouse(event) {
        return getPixelFromEvent(event);
    }

    function getBlockFromEvent(event) {
        const pixelPos = getPixelFromEvent(event);
        return [
            Math.floor(pixelPos.x / BLOCK_SIZE),
            Math.floor(pixelPos.y / BLOCK_SIZE)
        ];
    }

    function getBlockFromMouse(event) {
        return getBlockFromEvent(event);
    }

    // Touch utility functions
    function getTouchDistance(touches) {
        if (touches.length < 2) return 0;
        const touch1 = touches[0];
        const touch2 = touches[1];
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }

    function getTouchCenter(touches) {
        if (touches.length === 1) {
            return { x: touches[0].clientX, y: touches[0].clientY };
        }
        const x = (touches[0].clientX + touches[1].clientX) / 2;
        const y = (touches[0].clientY + touches[1].clientY) / 2;
        return { x, y };
    }

    // Magnifier functions
    function handleMagnifierToggle() {
        if (!isMobile) {
            setMagnifierActive(!magnifierActive);
            if (magnifierActive) {
                // Reset zoom level when turning off magnifier
                setClickZoomLevel(0);
            }
        }
    }

    function handleMagnifierZoomChange(delta) {
        const newZoom = Math.max(MIN_MAGNIFIER_ZOOM, Math.min(MAX_MAGNIFIER_ZOOM, magnifierZoom + delta));
        setMagnifierZoom(newZoom);
    }

    useEffect(() => {
        const preventPageZoom = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault()
            }
        }

        const preventKeyboardZoom = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=' || e.key === '_')) {
                e.preventDefault()
            }
        }

        // Add event listeners to document to prevent page zoom
        document.addEventListener('wheel', preventPageZoom, { passive: false })
        document.addEventListener('keydown', preventKeyboardZoom)

        return () => {
            document.removeEventListener('wheel', preventPageZoom)
            document.removeEventListener('keydown', preventKeyboardZoom)
        }
    }, [])

    // Handle wheel event for zooming
    function handleWheel(e) {
        if (magnifierActive && !isMobile) {
            e.preventDefault()
            // Zoom the magnifier
            const delta = e.deltaY > 0 ? -1 : 1
            handleMagnifierZoomChange(delta)
        } else if (!isMobile && e.ctrlKey) {
            e.preventDefault()

            const rect = canvasRef.current.getBoundingClientRect()
            const mouseX = (e.clientX - rect.left) * (canvasRef.current.width / rect.width)
            const mouseY = (e.clientY - rect.top) * (canvasRef.current.height / rect.height)

            const canvasX = (mouseX - offset.x) / zoom
            const canvasY = (mouseY - offset.y) / zoom

            const delta = -e.deltaY
            const zoomChange = delta > 0 ? 1 + ZOOM_FACTOR : 1 - ZOOM_FACTOR
            const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomChange))

            const newOffsetX = mouseX - canvasX * newZoom
            const newOffsetY = mouseY - canvasY * newZoom

            setZoom(newZoom)
            setOffset({ x: newOffsetX, y: newOffsetY })
        }
    }

    // Touch event handlers (unchanged for mobile)
    function handleTouchStart(e) {
        e.preventDefault();

        if (activeReservation) {
            toast.error("Cancel or continue transaction before reserving another.")
            return
        }

        const touches = Array.from(e.touches);
        setLastTouches(touches);

        if (touches.length === 2) {
            const distance = getTouchDistance(touches);
            setInitialPinchDistance(distance);
            setInitialZoom(zoom);
            setPanning(false);
            setTouchDrawing(false);
        } else if (touches.length === 1) {
            if (canDraw) {
                const pixelPos = getPixelFromEvent(e);
                setMousePixelPos(pixelPos);
                const block = getBlockFromEvent(e);
                setTouchDrawing(true);
                setDrawing(true);
                setStartBlock(block);
                setEndBlock(block);
            } else {
                const touch = touches[0];
                setPanning(true);
                setPanStart({
                    x: touch.clientX,
                    y: touch.clientY,
                    ox: offset.x,
                    oy: offset.y,
                });
            }
        }
    }

    function handleTouchMove(e) {
        e.preventDefault();

        const touches = Array.from(e.touches);

        if (touches.length === 2) {
            const distance = getTouchDistance(touches);
            const center = getTouchCenter(touches);

            if (initialPinchDistance > 0) {
                const scale = distance / initialPinchDistance;
                const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, initialZoom * scale));

                const rect = canvasRef.current.getBoundingClientRect();
                const centerX = (center.x - rect.left) * (canvasRef.current.width / rect.width);
                const centerY = (center.y - rect.top) * (canvasRef.current.height / rect.height);

                const canvasX = (centerX - offset.x) / zoom;
                const canvasY = (centerY - offset.y) / zoom;

                const newOffsetX = centerX - canvasX * newZoom;
                const newOffsetY = centerY - canvasY * newZoom;

                setZoom(newZoom);
                setOffset({ x: newOffsetX, y: newOffsetY });
            }
        } else if (touches.length === 1) {
            const touch = touches[0];

            if (touchDrawing && canDraw) {
                const pixel = getPixelFromEvent(e);
                setMousePixelPos(pixel);
                const block = getBlockFromEvent(e);
                setEndBlock(block);
            } else if (panning && panStart) {
                const dx = touch.clientX - panStart.x;
                const dy = touch.clientY - panStart.y;
                setOffset({
                    x: panStart.ox + dx,
                    y: panStart.oy + dy,
                });
            }
        }

        setLastTouches(touches);
    }

    async function handleTouchEnd(e) {
        e.preventDefault();

        const touches = Array.from(e.touches);

        if (touches.length === 0) {
            if (panning) {
                setPanning(false);
                setPanStart(null);
            }

            if (touchDrawing && canDraw && startBlock && endBlock) {
                const x1 = Math.min(startBlock[0], endBlock[0]);
                const y1 = Math.min(startBlock[1], endBlock[1]);
                const x2 = Math.max(startBlock[0], endBlock[0]);
                const y2 = Math.max(startBlock[1], endBlock[1]);

                const blockCoords = {
                    topLeft: [x1, y1],
                    bottomRight: [x2, y2],
                };

                const width = Math.abs(x2 - x1) + 1;
                const height = Math.abs(y2 - y1) + 1;
                const area = width * height;

                if (area < 4) {
                    toast.error("Cannot reserve area. Please select an area of at least 100 pixels.");
                    setDrawing(false);
                    setTouchDrawing(false);
                    setStartBlock(null);
                    setEndBlock(null);
                    return;
                }

                if (rectOverlaps(blockCoords, allReservations) || rectOverlaps(blockCoords, purchases)) {
                    toast.error("Cannot reserve overlapping pixels. Please select a free area.");
                    setDrawing(false);
                    setTouchDrawing(false);
                    setStartBlock(null);
                    setEndBlock(null);
                    return;
                }

                const pxTopLeft = blockToPixelCoords(blockCoords.topLeft);
                const pxBottomRight = [
                    (blockCoords.bottomRight[0] + 1) * BLOCK_SIZE,
                    (blockCoords.bottomRight[1] + 1) * BLOCK_SIZE,
                ];

                const coords = {
                    topLeft: pxTopLeft,
                    bottomRight: pxBottomRight,
                };

                setLastShapeCoords(coords);
                setModalCoords(coords);
                setShowReserveModal(true);
            }

            setTouchDrawing(false);
            setDrawing(false);
            setStartBlock(null);
            setEndBlock(null);
            setInitialPinchDistance(0);
            setInitialZoom(1);
        } else if (touches.length === 1 && lastTouches.length === 2) {
            setInitialPinchDistance(0);
            setInitialZoom(1);

            if (!canDraw) {
                const touch = touches[0];
                setPanning(true);
                setPanStart({
                    x: touch.clientX,
                    y: touch.clientY,
                    ox: offset.x,
                    oy: offset.y,
                });
            }
        }

        setLastTouches(touches);
    }

    function handleMouseDown(e) {
        e.preventDefault()
        if (e.button === 2) return

        if (activeReservation) {
            toast.error("Cancel or continue transaction before reserving another.")
            return
        }

        // Handle magnifier mode click-to-zoom
        if (!isMobile && magnifierActive && e.button === 0) {
            zoomToClickPoint(e);
            return;
        }

        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            setPanning(true)
            setPanStart({
                x: e.clientX,
                y: e.clientY,
                ox: offset.x,
                oy: offset.y,
            })
            return
        }
        if (!canDraw) return
        const pixelPos = getPixelFromMouse(e)
        setMousePixelPos(pixelPos)
        const block = getBlockFromMouse(e)
        setDrawing(true)
        setStartBlock(block)
        setEndBlock(block)
    }

    function handleMouseMove(e) {
        e.preventDefault()
        const pixel = getPixelFromMouse(e)
        setMousePixelPos(pixel)
        const block = getBlockFromMouse(e)

        // Update magnifier position
        if (!isMobile && magnifierActive) {
            setMagnifierPos({ x: e.clientX, y: e.clientY });
        }

        if (drawing) {
            setEndBlock(block)
        } else if (panning && panStart) {
            const dx = e.clientX - panStart.x
            const dy = e.clientY - panStart.y
            setOffset({
                x: panStart.ox + dx,
                y: panStart.oy + dy,
            })
        }
    }

    function handleMouseLeave() {
        // Keep magnifier active but hide it when mouse leaves
        if (!isMobile && magnifierActive) {
            setMagnifierPos({ x: -1000, y: -1000 });
        }
    }

    async function handleMouseUp(e) {
        e.preventDefault()
        if (panning) {
            setPanning(false)
            setPanStart(null)
            return
        }
        if (drawing && canDraw && startBlock && endBlock) {
            const x1 = Math.min(startBlock[0], endBlock[0])
            const y1 = Math.min(startBlock[1], endBlock[1])
            const x2 = Math.max(startBlock[0], endBlock[0])
            const y2 = Math.max(startBlock[1], endBlock[1])

            const blockCoords = {
                topLeft: [x1, y1],
                bottomRight: [x2, y2],
            }

            const width = Math.abs(x2 - x1) + 1
            const height = Math.abs(y2 - y1) + 1
            const area = width * height

            if (area < 4) {
                toast.error("Cannot reserve area. Please select an area of at least 100 pixels.")
                setDrawing(false)
                setStartBlock(null)
                setEndBlock(null)
                return
            }

            if (rectOverlaps(blockCoords, allReservations) || rectOverlaps(blockCoords, purchases)) {
                toast.error("Cannot reserve overlapping pixels. Please select a free area.")
                setDrawing(false)
                setStartBlock(null)
                setEndBlock(null)
                return
            }

            const pxTopLeft = blockToPixelCoords(blockCoords.topLeft)
            const pxBottomRight = [
                (blockCoords.bottomRight[0] + 1) * BLOCK_SIZE,
                (blockCoords.bottomRight[1] + 1) * BLOCK_SIZE,
            ]

            const coords = {
                topLeft: pxTopLeft,
                bottomRight: pxBottomRight,
            }

            setLastShapeCoords(coords)
            setModalCoords(coords)
            setShowReserveModal(true)
        }
        setDrawing(false)
        setStartBlock(null)
        setEndBlock(null)
    }

    function handleResetZoom() {
        setZoom(1)
        setOffset({ x: 0, y: 0 })
        setClickZoomLevel(0) // Reset click zoom level
    }

    function handleCanDrawToggle() {
        setCanDraw((prev) => !prev)
        setDrawing((p) => !p)
        if (activeReservation) setShowReservedPopover((p) => !p)
        setStartBlock(null)
        setEndBlock(null)
    }

    function handleContextMenu(e) {
        e.preventDefault()
    }

    async function handleReserveModalConfirmed() {
        setShowReserveModal(false)
        setShowReservedPopover(true)
        const coords = modalCoords
        const reservationId = String(Date.now()) + "-" + Math.floor(Math.random() * 1000000)
        try {
            await postReservation(reservationId, coords)
            saveReservation({ ...coords, reservationId })
            setActiveReservation({ ...coords, reservationId })
            setActiveReservationId(reservationId)
        } catch (err) { }
    }

    async function handleCancelTransaction() {
        setShowReservedPopover(false)
        if (activeReservationId) {
            await deleteReservation(activeReservationId)
        }
        clearReservation()
        setActiveReservation(null)
        setActiveReservationId(null)
    }

    function handleContinueTransaction() {
        if (!isAuthenticated) {
            router.push("/auth/login")
            return
        }
        setShowReservedPopover(false)
        setShowCompleteModal(true)
    }

    function handleCompleteModalClose() {
        setShowCompleteModal(false)
        clearReservation()
        setActiveReservation(null)
        setActiveReservationId(null)
    }

    function handleReserveModalClose() {
        setShowReserveModal(false)
        clearReservation()
        setActiveReservation(null)
        setActiveReservationId(null)
    }

    // Determine cursor style
    function getCursorStyle() {
        if (panning) return "grab"
        if (magnifierActive && !isMobile) return "none" // Hide cursor when magnifier is active
        if (drawing && canDraw) return "crosshair"
        return "pointer"
    }

    return (
        <div
            ref={canvasContainerRef}
            style={{
                width: "100%",
                maxWidth: "100vw",
                touchAction: "none",
                display: "flex",
                flexDirection: "column",
            }}
            className="rounded-lg relative"
        >
            <TopBar
                isExpanded={isFullscreen}
                expandClick={toggleFullscreen}
                mousePixelPos={mousePixelPos}
                lastShapeCoords={lastShapeCoords}
                canDraw={canDraw}
                onCanDrawToggle={handleCanDrawToggle}
                zoom={zoom}
                onResetZoom={handleResetZoom}
                magnifierActive={magnifierActive}
                onMagnifierToggle={handleMagnifierToggle}
                magnifierZoom={magnifierZoom}
                onMagnifierZoomChange={handleMagnifierZoomChange}
                isMobile={isMobile}
                clickZoomLevel={clickZoomLevel}
                clickZoomLevels={CLICK_ZOOM_LEVELS}
            />
            <canvas
                ref={canvasRef}
                width={PIXEL_CANVAS_WIDTH}
                height={PIXEL_CANVAS_HEIGHT}
                className="bg-dark-700 border border-border"
                style={{
                    width: '100%',
                    height: `${PIXEL_CANVAS_HEIGHT * canvasScale}px`,
                    maxWidth: "100vw",
                    maxHeight: "calc(100vh - 120px)",
                    display: "block",
                    cursor: getCursorStyle(),
                    userSelect: "none",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onContextMenu={handleContextMenu}
                onWheel={handleWheel}
                onTouchStart={isMobile ? handleTouchStart : undefined}
                onTouchMove={isMobile ? handleTouchMove : undefined}
                onTouchEnd={isMobile ? handleTouchEnd : undefined}
                onTouchCancel={isMobile ? handleTouchEnd : undefined}
            />
            <canvas
                ref={magnifierCanvasRef}
                width={PIXEL_CANVAS_WIDTH}
                height={PIXEL_CANVAS_HEIGHT}
                style={{ display: 'none' }}
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
    )
}

function drawImageOnGrid(ctx, topLeft, bottomRight, blockSize, img) {
    const x1 = Math.min(topLeft[0], bottomRight[0])
    const y1 = Math.min(topLeft[1], bottomRight[1])
    const x2 = Math.max(topLeft[0], bottomRight[0])
    const y2 = Math.max(topLeft[1], bottomRight[1])
    const width = (x2 - x1) * blockSize
    const height = (y2 - y1) * blockSize
    ctx.drawImage(img, x1 * blockSize, y1 * blockSize, width, height)
}

function drawRectOnGrid(ctx, topLeft, bottomRight, blockSize, color) {
    const x1 = Math.min(topLeft[0], bottomRight[0])
    const y1 = Math.min(topLeft[1], bottomRight[1])
    const x2 = Math.max(topLeft[0], bottomRight[0])
    const y2 = Math.max(topLeft[1], bottomRight[1])
    const px = x1 * blockSize
    const py = y1 * blockSize
    const width = (x2 - x1) * blockSize
    const height = (y2 - y1) * blockSize

    ctx.fillStyle = `${color}33`
    ctx.fillRect(px, py, width, height)

    ctx.lineWidth = BorderWidth
    ctx.strokeStyle = color
    ctx.strokeRect(px, py, width, height)
}
