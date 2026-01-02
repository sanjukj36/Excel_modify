import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Tooltip({ content, children }) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + rect.height / 2, // Center vertically relative to trigger
                left: rect.right + 12 // 12px gap
            });
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 100); // Small delay to prevent flickering
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="relative flex w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>

            {isVisible && createPortal(
                <div
                    className="fixed z-[9999] w-max max-w-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        transform: 'translateY(-50%)' // Center vertically
                    }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-sm text-slate-100 text-xs p-3 rounded-lg shadow-xl border border-slate-700/50 relative">
                        {/* Arrow pointing left, centered vertically */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full ml-[1px] border-[6px] border-transparent border-r-slate-900/95"></div>
                        {content}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
