import { NextResponse } from "next/server"
import { cleanupExpiredShares } from "@/lib/cleanup"

export const dynamic = 'force-dynamic' // Ensure this route is not cached

export async function GET() {
    try {
        const deletedCount = await cleanupExpiredShares()
        return NextResponse.json({
            message: "Cleanup successful",
            deletedShares: deletedCount
        })
    } catch (error) {
        console.error("Cleanup cron failed:", error)
        return NextResponse.json(
            { error: "Cleanup failed" },
            { status: 500 }
        )
    }
}
