"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { VisitorCounter } from "./visitor-counter";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);

    useGSAP(() => {
        const nav = navRef.current;
        if (!nav) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const diff = currentScrollY - lastScrollY.current;

            // Show/Hide logic
            if (currentScrollY > 100 && diff > 0) {
                // Scrolling down & past 100px - Hide
                gsap.to(nav, { yPercent: -100, duration: 0.3, ease: "power2.inOut" });
            } else if (diff < 0 || currentScrollY < 100) {
                // Scrolling up or at top - Show
                gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.inOut" });
            }

            setIsScrolled(currentScrollY > 20);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/70 backdrop-blur-md border-gray-200 shadow-sm"
                    : "bg-transparent border-transparent"
            )}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full px-6 py-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-xl font-bold font-display text-gray-900 tracking-tight">
                        github <i><span className="text-blue-600">actions</span></i>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    {["readme", "actions", "pages"].map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="group relative text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <VisitorCounter />
                    <a
                        href="https://github.com/vineetrajojha/readme-agent"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-gray-900/10"
                    >
                        <Github className="w-4 h-4" />
                        <span>Star on GitHub</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
