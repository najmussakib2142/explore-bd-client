// Skeleton.jsx
import React from "react";

export default function Skeleton({ width = "full", height = 4, className = "" }) {
    const widthClass = width === "full" ? "w-full" : `w-${width}`;
    return (
        <div
            className={`bg-gray-300 dark:bg-gray-700 ${widthClass} h-${height} ${className} animate-pulse`}
        ></div>
    );
}
