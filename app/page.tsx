"use client";

import { Hero } from "@/components/ui/hero";
import { Copy, Check, FileText, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [readme, setReadme] = useState("");
    const [copied, setCopied] = useState(false);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!url) {
            toast.error("Please enter a GitHub repository URL");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Analyzing repository & crafting README...");

        const fullUrl = url.startsWith("http") ? url : `https://github.com/${url}`;

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: fullUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate");
            }

            toast.success("README Generated!", { id: toastId });
            setReadme(data.readme);

            // Scroll to result after a short delay to allow animation to start
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);

        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(readme);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Hero
                url={url}
                setUrl={setUrl}
                handleGenerate={handleGenerate}
                loading={loading}
            />

            <AnimatePresence>
                {readme && (
                    <motion.div
                        ref={resultRef}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full max-w-5xl mx-auto px-6 pb-24"
                    >
                        <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-xl overflow-hidden ring-1 ring-gray-900/5">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Generated README.md</h2>
                                        <p className="text-xs text-gray-500">AI-generated content based on your codebase</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg border",
                                        copied
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    )}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied!" : "Copy Markdown"}
                                </button>
                            </div>

                            <div className="relative">
                                <textarea
                                    readOnly
                                    value={readme}
                                    className="w-full h-[600px] p-6 font-mono text-sm leading-relaxed bg-gray-50/30 text-gray-800 resize-none focus:outline-none selection:bg-blue-100 selection:text-blue-900"
                                    spellCheck={false}
                                />
                                <div className="absolute inset-0 pointer-events-none border-t border-gray-100/50 shadow-[inset_0_4px_20px_rgba(0,0,0,0.02)]" />
                            </div>

                            <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    Pro Tip: Add screenshots to your repo for an even better README.
                                </span>
                                <span>{readme.length} chars</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
