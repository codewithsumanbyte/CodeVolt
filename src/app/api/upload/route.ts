import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { nanoid } from "nanoid"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const textData = formData.get("textData") as string
    const password = formData.get("password") as string
    const language = formData.get("language") as string || "text"

    if (!files.length && !textData) {
      return NextResponse.json(
        { error: "No files or text data provided" },
        { status: 400 }
      )
    }

    // Generate unique code
    const code = nanoid(8).toUpperCase()

    // Create share record
    const share = await db.share.create({
      data: {
        code,
        textData: textData || null,
        password: password ? password : null,
        language,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })

    // Handle file uploads
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

    for (const file of files) {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 10MB limit` },
          { status: 400 }
        )
      }

      // Validate file type
      if (!allowedMimeTypes.includes(file.type) && !file.type.startsWith('text/')) {
        return NextResponse.json(
          { error: `File type "${file.type}" is not supported for "${file.name}"` },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = `${nanoid(16)}.${fileExtension}`
      const filePath = join(process.cwd(), "uploads", uniqueFileName)

      // Write file to disk
      await writeFile(filePath, buffer)

      // Save file record to database
      const fileRecord = await db.file.create({
        data: {
          fileName: file.name,
          filePath: uniqueFileName,
          fileSize: file.size,
          mimeType: file.type,
          shareId: share.id,
        },
      })

      uploadedFiles.push(fileRecord)
    }

    return NextResponse.json({
      code,
      message: "Data uploaded successfully",
      filesCount: uploadedFiles.length,
      hasTextData: !!textData,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 }
    )
  }
}