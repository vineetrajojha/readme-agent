"use client";

import { Globe } from "@/components/ui/globe";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!url) {
            toast.error("Please enter a GitHub repository (user/repo)");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Generating README...");

        // Construct full URL if user only entered path
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
            // Here you would typically redirect to a result page or show the markdown
            console.log(data.readme);
            toast("Check console for output (demo mode)", { icon: "ℹ️" });

        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white overflow-hidden relative pt-32">
            <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex">
                <div className="flex flex-col gap-8 max-w-2xl relative z-20">
                    <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                        AI README <br />
                        <span className="text-blue-600">Generator</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Generate comprehensive, beautiful README files for your GitHub projects in seconds using advanced AI.
                    </p>

                    <div className="mt-8 flex w-full max-w-md items-center space-x-2">
                        <div className="flex-1 flex items-center rounded-md border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                            <span className="pl-4 pr-1 text-gray-500 select-none">github.com/</span>
                            <input
                                type="text"
                                placeholder="user/repo"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 border-0 bg-transparent py-3 pl-1 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 focus:outline-none"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Generating..." : "Generate README"}
                        </button>
                    </div>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 opacity-100">
                    <Globe className="scale-125" />
                </div>
            </div>
        </main>
    );
}
