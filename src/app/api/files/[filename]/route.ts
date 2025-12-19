import { NextRequest, NextResponse } from "next/server"
import { readFile, unlink } from "fs/promises"
import { join } from "path"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params

    // Find file record
    const fileRecord = await db.file.findFirst({
      where: {
        filePath: filename
      },
      include: {
        share: {
          include: {
            files: true
          }
        }
      }
    })

    if (!fileRecord) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      )
    }

    // Check if share is expired
    if (fileRecord.share.expiresAt && fileRecord.share.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Access code has expired" },
        { status: 410 }
      )
    }

    // Read file from disk
    const filePath = join(process.cwd(), "uploads", filename)
    const fileBuffer = await readFile(filePath)

    // Check if it's a preview request
    const { searchParams } = new URL(request.url)
    const isPreview = searchParams.get('preview') === 'true'

    if (isPreview && fileRecord.mimeType === "application/pdf") {
      // Return PDF for inline viewing (preview)
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': fileRecord.mimeType,
          'Content-Disposition': `inline; filename="${fileRecord.fileName}"`,
          'Content-Length': fileRecord.fileSize.toString(),
        },
      })
    } else {
      // Return file for download
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': fileRecord.mimeType,
          'Content-Disposition': `attachment; filename="${fileRecord.fileName}"`,
          'Content-Length': fileRecord.fileSize.toString(),
        },
      })
    }
  } catch (error) {
    console.error("File download error:", error)
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params

    // Find file record
    const fileRecord = await db.file.findFirst({
      where: {
        filePath: filename
      }
    })

    if (!fileRecord) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      )
    }

    // Delete file from disk
    const filePath = join(process.cwd(), "uploads", filename)
    await unlink(filePath)

    // Delete file record from database
    await db.file.delete({
      where: {
        id: fileRecord.id
      }
    })

    return NextResponse.json({
      message: "File deleted successfully"
    })
  } catch (error) {
    console.error("File deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
}