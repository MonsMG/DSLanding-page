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
    <div className="min-h-screen bg-background relative overflow-hidden py-10 px-4">
      {/* Decorative Background for Admin */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto animate-fade-in-up">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
          onClick={() => navigate("/production")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Production Lookbook
        </Button>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-8 pt-8 px-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-[hsl(var(--ds-chocolate))]">
              Add Production Work
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Title (EN)
                  </Label>
                  <Input
                    name="title_en"
                    required
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Title (TH)
                  </Label>
                  <Input
                    name="title_th"
                    required
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                  Category
                </Label>
                <Input
                  name="category"
                  placeholder="Event, Documentary, Music Video"
                  required
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Media Type
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      handleSelectChange("media_type", val)
                    }
                    defaultValue="video"
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video (YouTube)</SelectItem>
                      <SelectItem value="image">Image (Gallery)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Featured?
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      setFormData({ ...formData, featured: val === "true" })
                    }
                    defaultValue="true"
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes (Show First)</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                  Media URL (YouTube Link / Image URL)
                </Label>
                <Input
                  name="media_url"
                  placeholder="https://youtube.com/..."
                  required
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-primary/10 pt-6">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Short Description (EN)
                  </Label>
                  <Textarea
                    name="short_desc_en"
                    onChange={handleChange}
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    rows={3}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Short Description (TH)
                  </Label>
                  <Textarea
                    name="short_desc_th"
                    onChange={handleChange}
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] transition-all duration-300 rounded-[20px] text-lg font-medium tracking-wide"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <Save className="mr-2 h-5 w-5" />
                  )}{" "}
                  Save Work
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
