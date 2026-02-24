/**
 * 📸 ImageUpload — คอมโพเนนต์สำหรับอัปโหลดรูปภาพไปยัง Supabase Storage
 *
 * การทำงาน:
 *   1. User คลิกพื้นที่ upload → เลือกไฟล์รูปภาพ
 *   2. ตรวจสอบขนาดไฟล์ (max 5MB) และประเภทไฟล์ (JPG, PNG, WebP, GIF)
 *   3. อัปโหลดไฟล์ไปที่ Supabase Storage bucket "images"
 *   4. ดึง Public URL กลับมาแล้วส่งค่าผ่าน onChange callback
 *   5. แสดง preview รูปที่อัปโหลดแล้ว พร้อมปุ่มลบ (X)
 *
 * Props:
 *   - value: string      → URL ของรูปปัจจุบัน (ถ้ามี)
 *   - onChange: (url) =>  → callback เมื่อมีรูปใหม่ หรือลบรูป
 *   - label?: string     → ชื่อ label (default: "Cover Image")
 *
 * วิธีใช้:
 *   <ImageUpload
 *     value={formData.image_url}
 *     onChange={(url) => setFormData({...formData, image_url: url})}
 *     label="ภาพปก"
 *   />
 */

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ✅ ค่า config สำหรับ validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  label = "Cover Image",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  /**
   * จัดการการอัปโหลดไฟล์:
   * 1. ตรวจสอบขนาดและประเภทไฟล์
   * 2. สร้างชื่อไฟล์แบบ random (ป้องกันชื่อซ้ำ)
   * 3. อัปโหลดไปที่ bucket "images" บน Supabase Storage
   * 4. ดึง Public URL แล้วส่งกลับผ่าน onChange
   */
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];

      // ✅ ตรวจสอบประเภทไฟล์
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Only JPG, PNG, WebP, and GIF are allowed.",
        });
        return;
      }

      // ✅ ตรวจสอบขนาดไฟล์ (max 5MB)
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 5MB.",
        });
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`; // ชื่อไฟล์ random
      const filePath = `${fileName}`;

      // อัปโหลดไฟล์ไปที่ Supabase Storage (bucket: "images")
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // ดึง Public URL ของไฟล์ที่อัปโหลด
      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      // ส่ง URL กลับไปให้ parent component
      onChange(data.publicUrl);
      toast({ title: "Uploaded", description: "Image uploaded successfully." });
    } catch {
      // ✅ ใช้ toast แทน alert — ไม่ leak error details
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Could not upload image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        // — กรณีมีรูปแล้ว: แสดง preview + ปุ่มลบ —
        <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-border bg-muted group">
          <img
            src={value}
            alt="Upload"
            className="object-cover w-full h-full"
          />
          {/* ปุ่มลบรูป — แสดงเมื่อ hover */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange("")} // ส่งค่าว่างกลับ = ลบรูป
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        // — กรณียังไม่มีรูป: แสดงปุ่ม upload —
        <div className="flex items-center justify-center w-full max-w-sm border-2 border-dashed rounded-lg p-6 bg-muted/5 hover:bg-muted/10 transition-colors">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Click to upload image"}
            </span>
            <span className="text-xs text-muted-foreground/60">
              JPG, PNG, WebP, GIF — max 5MB
            </span>
            {/* Input ซ่อนอยู่ — ถูก trigger ผ่าน label */}
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};
