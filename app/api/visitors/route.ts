import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "visitors.json");

// Helper to read visitors
function getVisitors(): string[] {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Helper to save visitors
function saveVisitors(visitors: string[]) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(visitors));
}

export async function GET() {
    const visitors = getVisitors();
    return NextResponse.json({ count: visitors.length });
}

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Hash IP for privacy
    const hash = crypto.createHash("sha256").update(ip).digest("hex");

    const visitors = getVisitors();

    if (!visitors.includes(hash)) {
        visitors.push(hash);
        saveVisitors(visitors);
    }

    return NextResponse.json({ count: visitors.length });
}
