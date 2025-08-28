export function saveReservation(coords) {
    localStorage.setItem("reservedPixels", JSON.stringify(coords));
}

function formatCoords(coord) {
    return Math.floor(coord / 10)
}

function isValidReservation(pixelShape) {
    const timeCreated = Number(pixelShape.reservationId.split("-")[0]);
    const currentTime = Date.now();
    const diffMinutes = (currentTime - timeCreated) / (1000 * 60);
    return diffMinutes <= 10;
}


export function getReservation() {
    try {
        const raw = JSON.parse(localStorage.getItem("reservedPixels"));
        if (!(raw.topLeft && raw.bottomRight)) return null;
        const isValid = isValidReservation(raw);
        if (isValid)
            return raw
        return null
    } catch {
        return null;
    }
}

export function clearReservation() {
    localStorage.removeItem("reservedPixels");
}

export function saveShapes(shapes) {
    localStorage.setItem("pixelShapes", JSON.stringify(shapes));
}

export function deleteReservations(coords) {
    const shapes = getShapes()
    const bottomRight = [
        formatCoords(coords.bottomRight[0]),
        formatCoords(coords.bottomRight[1])
    ]
    const shapesEndCoords = shapes?.map(v => v.bottomRight)
    const index = shapesEndCoords?.findIndex(v => v[0] == bottomRight[0] && v[1] == bottomRight[1])
    shapes?.splice(index, 1)
    saveShapes(shapes || null)
}

export function getShapes() {
    try {
        return JSON.parse(localStorage.getItem("pixelShapes")) || [];
    } catch {
        return [];
    }
}
