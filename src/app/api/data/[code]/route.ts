import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    // Validate code format
    if (!code || code.length !== 8 || !/^[A-Z0-9]+$/i.test(code)) {
      return NextResponse.json(
        { error: "Invalid access code format" },
        { status: 400 }
      )
    }

    // Find share by code (only if no password is set)
    // We fetch even if expired to trigger cleanup
    const share = await db.share.findFirst({
      where: {
        code: code.toUpperCase(),
        password: null,
      },
      include: {
        files: true
      }
    })

    if (!share) {
      return NextResponse.json(
        { error: "Invalid or expired access code" },
        { status: 404 }
      )
    }

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      // Trigger cleanup of all expired shares (including this one)
      const { cleanupExpiredShares } = await import("@/lib/cleanup")
      await cleanupExpiredShares()

      return NextResponse.json(
        { error: "Invalid or expired access code" },
        { status: 404 }
      )
    }

    // Check if share has any data
    if (!share.textData && share.files.length === 0) {
      return NextResponse.json(
        { error: "No data found for this access code" },
        { status: 404 }
      )
    }

    // Prepare file URLs
    const filesWithUrls = share.files.map(file => ({
      ...file,
      url: `/api/files/${file.filePath}`,
      createdAt: file.createdAt
    }))

    return NextResponse.json({
      id: share.id,
      code: share.code,
      textData: share.textData,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
      files: filesWithUrls
    })
  } catch (error) {
    console.error("Retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    // Validate code format
    if (!code || code.length !== 8 || !/^[A-Z0-9]+$/i.test(code)) {
      return NextResponse.json(
        { error: "Invalid access code format" },
        { status: 400 }
      )
    }

    // Find share by code
    const share = await db.share.findFirst({
      where: {
        code: code.toUpperCase(),
      },
      include: {
        files: true
      }
    })

    if (!share) {
      return NextResponse.json(
        { error: "Invalid or expired access code" },
        { status: 404 }
      )
    }

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      const { cleanupExpiredShares } = await import("@/lib/cleanup")
      await cleanupExpiredShares()

      return NextResponse.json(
        { error: "Invalid or expired access code" },
        { status: 404 }
      )
    }

    // Check for new text data
    let textData = ""
    let files: File[] = []
    let providedPassword = ""

    // Try parsing FormData
    try {
      const formData = await request.formData()
      textData = formData.get("textData") as string || ""
      files = formData.getAll("files") as File[]

      const pwd = formData.get("password") as string
      if (pwd) {
        try {
          const parsed = JSON.parse(pwd)
          if (parsed.password) providedPassword = parsed.password
          else providedPassword = pwd
        } catch {
          providedPassword = pwd
        }
      }
    } catch (e) {
      // Fallback or ignore if no body (shouldn't happen with our frontend)
      console.error("Error parsing formData:", e)
    }

    if (share.password) {
      if (!providedPassword || providedPassword !== share.password) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 401 }
        )
      }
    }

    let updatedShare = share
    if (textData) {
      const newTextData = share.textData
        ? `${share.textData}\n\n--- Appended ---\n\n${textData}`
        : textData

      updatedShare = await db.share.update({
        where: { id: share.id },
        data: {
          textData: newTextData,
          // language field removed
        },
        include: { files: true }
      })
    }

    // Handle File Uploads
    const uploadedFiles: any[] = []

    const allowedMimeTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/zip',
      'application/x-zip-compressed'
    ]

    const { writeFile } = await import("fs/promises")
    const { nanoid } = await import("nanoid")

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) continue
      if (!allowedMimeTypes.includes(file.type) && !file.type.startsWith('text/')) continue

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${nanoid(16)}.${fileExtension}`
      const filePath = join(process.cwd(), "uploads", uniqueFileName)

      await writeFile(filePath, buffer)

      const fileRecord = await db.file.create({
        data: {
          fileName: file.name,
          filePath: uniqueFileName,
          fileSize: file.size,
          mimeType: file.type,
          shareId: updatedShare.id,
        },
      })
      uploadedFiles.push(fileRecord)
    }

    // Refresh files list
    const allFiles = await db.file.findMany({
      where: { shareId: updatedShare.id }
    })

    const allFilesWithUrls = allFiles.map(file => ({
      ...file,
      url: `/api/files/${file.filePath}`,
      createdAt: file.createdAt
    }))

    return NextResponse.json({
      id: updatedShare.id,
      code: updatedShare.code,
      textData: updatedShare.textData,
      // language removed
      createdAt: updatedShare.createdAt,
      expiresAt: updatedShare.expiresAt,
      files: allFilesWithUrls
    })
  } catch (error) {
    console.error("Retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    )
  }
}