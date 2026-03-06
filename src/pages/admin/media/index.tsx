/**
 * 📁 Admin Media & Document Manager
 *
 * การทำงาน:
 *   1. ดึงข้อมูลรายการไฟล์ใน bucket "images" จาก Supabase Storage
 *   2. อัปโหลดไฟล์ใหม่ (รูปภาพปกติ, PDF, Word, Zip ฯลฯ)
 *   3. ลบไฟล์
 *   4. คัดลอกลิงก์ไฟล์ (Public URL) เพื่อไปใช้งานที่อื่น
 */

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Upload,
  Trash2,
  File,
  Image as ImageIcon,
  Copy,
  Link as LinkIcon,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

// Helper เพื่อดูว่าไฟล์เป็นรูปภาพหรือไม่
const isImageFile = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
};

// Size formatter
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function AdminMediaManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage.from("images").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) throw error;

      // Filter out empty folder placeholders (often represented as .emptyFolderPlaceholder)
      const validFiles = (data || []).filter(
        (f) => f.name !== ".emptyFolderPlaceholder",
      );
      setFiles(validFiles);
    } catch (err: unknown) {
      console.error("Fetch files error:", err);
      toast({
        variant: "destructive",
        title: "Error fetching files",
        description: "Failed to load files from storage.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // 2️⃣ ฟังก์ชันอัปโหลดไฟล์หลายไฟล์พร้อมกัน
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;

      setIsUploading(true);
      const uploadPromises = Array.from(event.target.files).map(
        async (file) => {
          // ใช้ชื่อไฟล์เดิมแต่เพิ่ม timestamp ป้องกันชื่อซ้ำ
          const fileExt = file.name.split(".").pop();
          const baseName = file.name.replace(`.${fileExt}`, "");
          // ทำชื่อไฟล์คลีนๆ
          const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, "_");
          const fileName = `${cleanName}_${Date.now()}.${fileExt}`;

          const { error } = await supabase.storage
            .from("images")
            .upload(fileName, file);

          if (error) throw error;
          return fileName;
        },
      );

      await Promise.all(uploadPromises);

      toast({
        title: "Success",
        description: `${event.target.files.length} file(s) uploaded successfully.`,
      });

      // ล้าง input และดึงข้อมูลใหม่
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchFiles();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          "An error occurred while uploading. Ensure you have permission.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 3️⃣ ลบไฟล์
  const handleDelete = async (fileName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${fileName}"? This cannot be undone.`,
      )
    )
      return;

    try {
      const { error } = await supabase.storage
        .from("images")
        .remove([fileName]);
      if (error) throw error;

      toast({
        title: "Deleted",
        description: "File has been removed successfully.",
      });

      fetchFiles();
    } catch (err: unknown) {
      console.error("Delete error:", err);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not remove the file.",
      });
    }
  };

  // 4️⃣ คัดลอก Public URL
  const copyToClipboard = (fileName: string) => {
    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    navigator.clipboard.writeText(data.publicUrl);
    toast({
      title: "Copied!",
      description: "Public URL copied to clipboard.",
    });
  };

  // ฟังก์ชันสำหรับกดย้อนกลับ (ป้องกัน Loop / ออกนอกเว็บ)
  const handleGoBack = () => {
    // location.key === "default" แปลว่าหน้านี้คือหน้าแรกที่เพิ่งเปิดแท็บขึ้นมา
    if (location.key !== "default") {
      navigate(-1); // มีประวัติ ให้ถอยหลัง 1 หน้า
    } else {
      navigate("/"); // ไม่มีประวัติ (เปิดลิงก์มาตรงๆ) ให้เด้งกลับหน้า Home แทน
    }
  };

  return (
    <div className="min-h-screen bg-background relative py-10 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto animate-fade-in-up">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Media & Document Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage your images, PDFs, and other documents here.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-12 px-6 shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] transition-all duration-300 rounded-xl"
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-5 w-5" />
              )}
              Upload Files
            </Button>
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-[2rem] overflow-hidden min-h-[500px]">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-6 pt-8 px-8 sm:px-10">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-[hsl(var(--ds-chocolate))]">
              Storage Files
              <span className="text-sm font-normal text-muted-foreground ml-2 px-3 py-1 bg-white/50 rounded-full">
                Bucket: "images"
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 sm:p-10">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-center border-2 border-dashed border-border rounded-2xl bg-muted/20">
                <File className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground">
                  No files found
                </h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Upload some images or documents to get started. Files will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {files.map((file) => {
                  const isImage = isImageFile(file.name);
                  const { data: publicUrlData } = supabase.storage
                    .from("images")
                    .getPublicUrl(file.name);

                  return (
                    <div
                      key={file.id}
                      className="group relative flex flex-col bg-white/50 border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      {/* Preview Area (Top half) */}
                      <div className="h-40 w-full bg-muted/30 flex items-center justify-center p-4 border-b border-border/50 relative overflow-hidden">
                        {isImage ? (
                          <img
                            src={publicUrlData.publicUrl}
                            alt={file.name}
                            className="object-cover w-full h-full rounded-md absolute inset-0 z-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center z-10">
                            <File className="w-12 h-12 text-primary opacity-80" />
                            <span className="mt-2 text-sm font-bold opacity-70 text-primary">
                              {file.name.split(".").pop()?.toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center gap-3 backdrop-blur-sm">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-10 h-10 rounded-full hover:scale-110 transition-transform"
                            onClick={() =>
                              window.open(publicUrlData.publicUrl, "_blank")
                            }
                            title="Open in new tab"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="w-10 h-10 rounded-full hover:scale-110 transition-transform bg-destructive/90"
                            onClick={() => handleDelete(file.name)}
                            title="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* File Info Area (Bottom half) */}
                      <div className="p-4 flex flex-col gap-1 flex-1 pointer-events-none">
                        <div className="flex items-center gap-2 mb-1">
                          {isImage ? (
                            <ImageIcon className="w-4 h-4 text-orange-500" />
                          ) : (
                            <File className="w-4 h-4 text-blue-500" />
                          )}
                          <p
                            className="text-sm font-bold text-foreground truncate max-w-[200px]"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{formatBytes(file.metadata?.size || 0)}</span>
                          <span>
                            {new Date(file.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Quick Action Bar (Bottom edge) */}
                      <div className="px-4 py-3 bg-muted/20 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium text-muted-foreground mr-2">
                          Public URL
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-primary hover:bg-primary/10 w-full"
                          onClick={() => copyToClipboard(file.name)}
                        >
                          <Copy className="w-3.5 h-3.5 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
