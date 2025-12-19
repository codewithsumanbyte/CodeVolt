import { db } from "@/lib/db"
import { unlink } from "fs/promises"
import { join } from "path"

export async function cleanupExpiredShares() {
    try {
        const expiredShares = await db.share.findMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
            include: {
                files: true,
            },
        })

        console.log(`Found ${expiredShares.length} expired shares to clean up.`)

        for (const share of expiredShares) {
            // Delete files from disk
            for (const file of share.files) {
                try {
                    const filePath = join(process.cwd(), "uploads", file.filePath)
                    await unlink(filePath)
                    console.log(`Deleted file: ${filePath}`)
                } catch (err) {
                    console.error(`Failed to delete file ${file.filePath}:`, err)
                    // Continue even if file delete fails (it might be already gone)
                }
            }

            // Delete share from DB (this should cascade delete file records if configured, otherwise we need to delete them explicitly)
            // Assuming Prisma schema handles foreign key constraints or we delete explicitly.
            // Safer to delete files first if no cascade.
            await db.file.deleteMany({
                where: {
                    shareId: share.id
                }
            })

            await db.share.delete({
                where: {
                    id: share.id,
                },
            })

            console.log(`Deleted share ID: ${share.id}`)
        }

        return expiredShares.length
    } catch (error) {
        console.error("Error cleaning up expired shares:", error)
        throw error
    }
}
