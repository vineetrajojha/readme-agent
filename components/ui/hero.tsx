"use client";

import { useRef } from "react";
import { Globe } from "@/components/ui/globe";
import { ArrowRight, Github } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HeroProps {
    url: string;
    setUrl: (url: string) => void;
    handleGenerate: () => void;
    loading: boolean;
}

export function Hero({ url, setUrl, handleGenerate, loading }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Staggered Text Reveal
        tl.fromTo(
            ".hero-text-element",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15 }
        );

        // Input & Button Reveal
        tl.fromTo(
            ".hero-input-element",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
            "-=0.5"
        );

        // Globe Float & Reveal
        gsap.fromTo(
            globeRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.2 }
        );

        // Continuous Floating Animation for Globe
        gsap.to(globeRef.current, {
            y: 15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70 pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content */}
                <div ref={textRef} className="flex flex-col gap-8 max-w-2xl">
                    <div className="hero-text-element inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">Actions Made Simpler with AI</span>
                    </div>

                    <h1 className="hero-text-element text-5xl sm:text-7xl font-bold font-display tracking-tight text-gray-900 leading-[1.1]">
                        Generate perfect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">READMEs</span> in seconds.
                    </h1>

                    <p className="hero-text-element text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                        Transform your code repositories into compelling documentation.
                        Our AI analyzes your codebase and crafts the perfect README for you.
                    </p>

                    <div className="hero-input-element flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-lg relative group">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Github className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="github.com/user/repo"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 pl-11 pr-4 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:bg-white transition-all duration-200"
                            />
                            {/* Glow effect on focus */}
                            <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:scale-[1.02] hover:shadow-blue-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group/btn"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Generate
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="hero-input-element flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <span className="text-green-500">✓</span> Free to use
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-green-500">✓</span> No signup required
                        </span>
                    </div>
                </div>

                {/* Right Visual - Globe */}
                <div ref={globeRef} className="relative hidden lg:block h-[600px] w-full perspective-[1000px]">
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full transform scale-75" />
                    <div className="relative w-full h-full transform-style-3d">
                        <Globe className="w-full h-full scale-110" />
                    </div>
                </div>
            </div>
        </section>
    );
}
