"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { VisitorCounter } from "./visitor-counter";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-md border-b border-gray-200">
            <div className="flex items-center gap-2">
                <Link href="/" className="text-xl font-bold text-gray-900">
                    README Agent
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Features
                </Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Pricing
                </Link>
                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Blog
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <VisitorCounter />
                <a
                    href="https://github.com/vineetrajojha/readme-agent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                >
                    <Github className="w-4 h-4" />
                    <span>Star on GitHub</span>
                </a>
            </div>
        </nav>
    );
}
