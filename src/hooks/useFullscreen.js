import { useCallback, useState, useEffect } from "react";

export function useToggleFullscreen(ref) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        function handleFullscreenChange() {
            const fullscreen =
                document.fullscreenElement === ref.current ||
                document.webkitFullscreenElement === ref.current ||
                document.msFullscreenElement === ref.current;
            setIsFullscreen(!!fullscreen);
        }
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("msfullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("msfullscreenchange", handleFullscreenChange);
        };
    }, [ref]);

    const toggleFullscreen = useCallback(() => {
        if (!ref.current) return;
        if (
            document.fullscreenElement === ref.current ||
            document.webkitFullscreenElement === ref.current ||
            document.msFullscreenElement === ref.current
        ) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
        } else {
            if (ref.current.requestFullscreen) ref.current.requestFullscreen();
            else if (ref.current.webkitRequestFullscreen) ref.current.webkitRequestFullscreen();
            else if (ref.current.msRequestFullscreen) ref.current.msRequestFullscreen();
        }
    }, [ref]);

    return [isFullscreen, toggleFullscreen];
}
