"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Download, Copy, FileText, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [textData, setTextData] = useState("")
  // Removed language state
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [accessPassword, setAccessPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [retrievedData, setRetrievedData] = useState<any>(null)
  const [previewFile, setPreviewFile] = useState<any>(null)

  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])





  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }

  const handleUpload = async () => {
    if (!files.length && !textData.trim()) {
      toast({
        title: "Error",
        description: "Please upload files or enter text data",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })
      if (textData.trim()) {
        formData.append("textData", textData)
      }
      if (password.trim()) {
        formData.append("password", password)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setGeneratedCode(data.code)
      toast({
        title: "Success",
        description: "Your data has been stored successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to store data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetrieve = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an access code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/data/${accessCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: accessPassword.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Data not found")
      }

      const data = await response.json()
      setRetrievedData(data)
      toast({
        title: "Success",
        description: "Data accessed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid or expired access code",
        variant: "destructive",
      })
      setRetrievedData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    if (isMounted) {
      navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      })
    }
  }

  const downloadFile = (file: any) => {
    if (isMounted) {
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const viewFile = (file: any) => {
    if (isMounted) {
      setPreviewFile(file)
    }
  }

  const deleteFile = async (file: any) => {
    if (!isMounted) return

    try {
      const response = await fetch(`/api/files/${file.filePath}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      // Remove the file from the retrieved data
      if (retrievedData) {
        const updatedFiles = retrievedData.files.filter((f: any) => f.id !== file.id)
        setRetrievedData({
          ...retrievedData,
          files: updatedFiles
        })
      }

      toast({
        title: "Success",
        description: "File deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary transition-colors duration-300">
      <main className="container max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center space-y-8 sm:space-y-12">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="text-center space-y-4 sm:space-y-6 pt-12 sm:pt-20 fade-in-5 relative">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20 shadow-lg shadow-primary/10 backdrop-blur-sm transition-transform hover:scale-105 duration-300">
              <div className="bg-gradient-to-br from-primary to-violet-600 p-2 rounded-xl">
                <Upload className="w-8 h-8 text-white rotate-3" />
              </div>
            </div>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground pb-2">
              Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">Volt</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium mx-auto leading-relaxed">
              Securely share your world with <br className="hidden sm:block" /> <span className="text-foreground font-semibold">military-grade encryption</span>
            </p>
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full" key={isMounted ? "client" : "server"}>
          <TabsList className="grid w-full grid-cols-2 h-12 sm:h-auto">
            <TabsTrigger value="upload" className="text-xs sm:text-sm py-2 sm:py-3">Store Data</TabsTrigger>
            <TabsTrigger value="retrieve" className="text-xs sm:text-sm py-2 sm:py-3">Access Data</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 fade-in-10 slide-in-from-bottom-5 duration-500">
            <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-xl">
              <CardHeader className="pb-6 border-b border-border/50">
                <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-primary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <span>Store Data</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Upload files or paste text to generate a secure, temporary access code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="files" className="block text-sm font-medium mb-2">
                      Files (Optional)
                    </label>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="cursor-pointer text-sm"
                    />
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">{(file.size / 1024).toFixed(1)} KB</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="text" className="block text-sm font-medium">
                        Text / Code (Optional)
                      </label>
                    </div>
                    <Textarea
                      id="text"
                      placeholder="Paste your code or text here..."
                      value={textData}
                      onChange={(e) => setTextData(e.target.value)}
                      rows={8}
                      className="text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password Protection (Optional)
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password to protect your data..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={isLoading || (!files.length && !textData.trim())}
                  className="w-full h-10 sm:h-auto text-sm sm:text-base"
                >
                  {isLoading ? "Storing..." : "Store & Generate Code"}
                </Button>

                {generatedCode && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                        <div className="space-y-1 text-center sm:text-left">
                          <p className="text-sm font-medium text-green-900">
                            Your Access Code
                          </p>
                          <p className="text-xl sm:text-2xl font-mono font-bold text-green-700">
                            {generatedCode}
                          </p>
                          {password && (
                            <p className="text-xs text-green-600">
                              🔒 Protected with password
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCode)}
                          className="w-full sm:w-auto text-xs sm:text-sm"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-green-600 mt-2 text-center sm:text-left">
                        Save this code to retrieve your data later. Code expires in 24 hours.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retrieve" className="space-y-6 fade-in-10 slide-in-from-bottom-5 duration-500">
            <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-xl">
              <CardHeader className="pb-6 border-b border-border/50">
                <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-primary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <span>Retrieve Data</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your unique 8-character code to access stored content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    placeholder="Enter access code..."
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="font-mono text-sm flex-1"
                    maxLength={8}
                  />
                  <Button onClick={handleRetrieve} disabled={isLoading} className="h-10 sm:h-auto text-sm sm:text-base">
                    {isLoading ? "Accessing..." : "Access"}
                  </Button>
                </div>

                <div>
                  <label htmlFor="accessPassword" className="block text-sm font-medium mb-2">
                    Password (If protected)
                  </label>
                  <Input
                    id="accessPassword"
                    type="password"
                    placeholder="Enter password if required..."
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    className="text-sm"
                  />
                </div>

                {retrievedData && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Accessed Data</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {retrievedData.textData && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Text Content</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(retrievedData.textData)}
                                className="h-8 text-xs sm:text-sm"
                              >
                                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                              <p className="text-sm whitespace-pre-wrap">{retrievedData.textData}</p>
                            </div>
                          </div>
                        )}

                        {retrievedData.files && retrievedData.files.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Files</h4>
                            <div className="space-y-2">
                              {retrievedData.files.map((file: any, index: number) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md space-y-2 sm:space-y-0">
                                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-sm truncate">{file.fileName}</p>
                                      <p className="text-xs text-slate-500">
                                        {(file.fileSize / 1024).toFixed(1)} KB • Added {new Date(file.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => viewFile(file)}
                                      className="text-xs h-8 sm:h-auto"
                                    >
                                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      Preview
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => downloadFile(file)}
                                      className="text-xs h-8 sm:h-auto"
                                    >
                                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      Download
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteFile(file)}
                                      className="text-xs h-8 sm:h-auto text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="text-xs text-slate-500">
                          <p>Created: {new Date(retrievedData.createdAt).toLocaleDateString()} {new Date(retrievedData.createdAt).toLocaleTimeString()}</p>
                          {retrievedData.expiresAt && (
                            <p>Expires: {new Date(retrievedData.expiresAt).toLocaleDateString()} {new Date(retrievedData.expiresAt).toLocaleTimeString()}</p>
                          )}
                          {retrievedData.files && retrievedData.files.length > 0 && (
                            <p>Total Files: {retrievedData.files.length}</p>
                          )}
                          {accessPassword && (
                            <p className="text-green-600">🔒 Password protected</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>


                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>


        {/* Footer */}
        <footer className="w-full py-8 mt-auto border-t border-border/40 backdrop-blur-sm bg-background/50">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 CodeVolt. Secure file sharing.</p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="hover:text-primary transition-colors font-medium">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors font-medium">
                Privacy
              </Link>
              <span className="flex items-center gap-1">
                Made with <span className="text-red-500 animate-pulse">⚡</span> by Suman
              </span>
            </div>
          </div>
        </footer>
      </main >

      {/* File Preview Modal */}
      < Dialog open={!!previewFile
      } onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-full sm:max-w-6xl max-h-[90vh] p-0 m-2 sm:m-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <DialogTitle className="text-base sm:text-lg truncate">
              {previewFile?.fileName}
            </DialogTitle>
          </DialogHeader>
          {previewFile && (
            <div className="w-full h-[60vh] sm:h-[80vh] bg-white">
              {previewFile.mimeType.startsWith('image/') ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.fileName}
                  className="w-full h-full object-contain"
                />
              ) : previewFile.mimeType === 'application/pdf' ? (
                <iframe
                  src={`${previewFile.url}?preview=true`}
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                />
              ) : previewFile.mimeType.startsWith('text/') ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-0"
                  title="Text Viewer"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-400 mb-4" />
                    <p className="text-base sm:text-lg font-medium text-slate-700">
                      {previewFile.fileName}
                    </p>
                    <p className="text-sm text-slate-500 mb-4">
                      {(previewFile.fileSize / 1024).toFixed(1)} KB
                    </p>
                    <Button onClick={() => downloadFile(previewFile)} className="text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog >
    </div >
  )
}