"use client";

import { useEffect, useState } from "react";

export function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        // Increment on mount
        fetch("/api/visitors", { method: "POST" })
            .then((res) => res.json())
            .then((data) => setCount(data.count))
            .catch((err) => console.error("Failed to fetch visitor count", err));
    }, []);

    if (count === null) {
        return <span className="text-xs text-gray-500">Loading stats...</span>;
    }

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            <span className="font-semibold">{count.toLocaleString()}</span>
            <span className="text-xs">Visitors</span>
        </div>
    );
}
