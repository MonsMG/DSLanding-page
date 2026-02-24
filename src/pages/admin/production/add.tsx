/**
 * ➕ AddProduction — ฟอร์มเพิ่มผลงาน Production ใหม่
 *
 * การทำงาน:
 *   1. กรอกข้อมูลผลงาน (ชื่อ, หมวดหมู่, ประเภทสื่อ, URL)
 *   2. อัปโหลด Thumbnail ผ่าน ImageUpload component
 *   3. กดบันทึก → validate → trim → insert ลง Supabase (table: production_works)
 *   4. สำเร็จ → redirect ไปหน้า /production
 *
 * หมายเหตุ:
 *   - Media URL เป็น text input (เพราะ YouTube links ไม่ใช่รูปภาพ)
 *   - Thumbnail ใช้ ImageUpload (อัปโหลดรูปจริง)
 *   - มี Select dropdown สำหรับ media_type และ featured
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function AddProduction() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // — State ของฟอร์ม (ตรงกับ columns ใน table production_works) —
  const [formData, setFormData] = useState({
    title_en: "",
    title_th: "",
    short_desc_en: "",
    short_desc_th: "",
    category: "Event",
    media_type: "video", // "video" = YouTube, "image" = Gallery
    media_url: "", // URL ของ YouTube หรือรูปภาพ
    thumbnail_url: "", // ← ได้ค่าจาก ImageUpload
    featured: true, // แสดงเป็นงานเด่นหรือไม่
  });

  // จัดการ input แบบ generic
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // จัดการ Select dropdown (ไม่มี e.target.name)
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // ตรวจสอบข้อมูลก่อนส่ง
  const validateForm = (): boolean => {
    if (!formData.title_en.trim() || !formData.title_th.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Title (EN) and Title (TH) are required.",
      });
      return false;
    }
    if (!formData.category.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Category is required.",
      });
      return false;
    }
    if (!formData.media_url.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Media URL is required.",
      });
      return false;
    }
    return true;
  };

  // ส่งข้อมูลไป Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Trim string fields ก่อนส่ง
      const cleanData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [
          key,
          typeof val === "string" ? val.trim() : val,
        ]),
      );

      const { error } = await supabase
        .from("production_works")
        .insert([cleanData]);

      if (error) {
        if (
          error.code === "42501" ||
          error.message?.toLowerCase().includes("permission")
        ) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You do not have permission to perform this action.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to save production work. Please try again.",
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Production work created successfully!",
      });
      navigate("/production");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/production")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add Production Work</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* — ชื่อผลงาน (EN/TH) — */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (EN)</Label>
                <Input name="title_en" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Title (TH)</Label>
                <Input name="title_th" required onChange={handleChange} />
              </div>
            </div>

            {/* — หมวดหมู่ — */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                name="category"
                placeholder="Event, Documentary, Music Video"
                required
                onChange={handleChange}
              />
            </div>

            {/* — ประเภทสื่อ & Featured — */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Media Type</Label>
                <Select
                  onValueChange={(val) => handleSelectChange("media_type", val)}
                  defaultValue="video"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video (YouTube)</SelectItem>
                    <SelectItem value="image">Image (Gallery)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Featured?</Label>
                <Select
                  onValueChange={(val) =>
                    setFormData({ ...formData, featured: val === "true" })
                  }
                  defaultValue="true"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes (Show First)</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* — Media URL (YouTube/Image link — ยังเป็น text input เพราะไม่ใช่ไฟล์อัปโหลด) — */}
            <div className="space-y-2">
              <Label>Media URL (YouTube Link / Image URL)</Label>
              <Input
                name="media_url"
                placeholder="https://youtube.com/..."
                required
                onChange={handleChange}
              />
            </div>

            {/* — Thumbnail (ใช้ ImageUpload — อัปโหลดรูปจริง) — */}
            <ImageUpload
              value={formData.thumbnail_url}
              onChange={(url) =>
                setFormData({ ...formData, thumbnail_url: url })
              }
              label="Thumbnail Image (Cover)"
            />

            {/* — คำอธิบายสั้น (EN/TH) — */}
            <div className="space-y-2">
              <Label>Short Description (EN)</Label>
              <Textarea name="short_desc_en" onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Short Description (TH)</Label>
              <Textarea name="short_desc_th" onChange={handleChange} />
            </div>

            {/* — ปุ่มบันทึก — */}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}{" "}
              Save Work
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
