import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({ content, children }) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position to the right of the element
            setCoords({
                top: rect.top, // Align top
                left: rect.right + 12 // 12px gap
            });
            setIsVisible(true);
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="relative flex w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>

            {isVisible && createPortal(
                <div
                    className="fixed z-[9999] w-48 pointer-events-none animate-in fade-in duration-150"
                    style={{ top: coords.top, left: coords.left }}
                >
                    <div className="bg-slate-800 text-white text-xs p-3 rounded-lg shadow-2xl border border-slate-600 relative">
                        {/* Little arrow pointing left */}
                        <div className="absolute left-0 top-3 -translate-x-full ml-1 border-4 border-transparent border-r-slate-800"></div>
                        {content}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
