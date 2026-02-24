/**
 * ✏️ EditProduction — ฟอร์มแก้ไขผลงาน Production ที่มีอยู่แล้ว
 *
 * การทำงาน:
 *   1. ดึง ID จาก URL → fetch ข้อมูลเดิมจาก Supabase
 *   2. เติมข้อมูลเดิมลงฟอร์ม
 *   3. User แก้ไข → กดบันทึก → validate → trim → update
 *   4. สำเร็จ → redirect กลับไปหน้า /production
 *
 * ความปลอดภัย:
 *   - ตัด id, created_at ออกก่อน update
 *   - ป้องกัน double submit ด้วย isSaving
 *   - ตรวจสอบ RLS error → แจ้ง "Unauthorized"
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditProduction() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ ID จาก URL (เช่น /admin/production/edit/456)
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // — State ของฟอร์ม —
  const [formData, setFormData] = useState({
    title_en: "",
    title_th: "",
    short_desc_en: "",
    short_desc_th: "",
    category: "",
    media_type: "video",
    media_url: "",
    thumbnail_url: "",
    featured: false,
  });

  // ดึงข้อมูลเดิมจาก Supabase
  useEffect(() => {
    const fetchWork = async () => {
      const { data, error } = await supabase
        .from("production_works")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load production data.",
        });
        navigate("/production");
      } else {
        setFormData(data); // เติมข้อมูลเดิมลงฟอร์ม
        setIsLoading(false);
      }
    };
    fetchWork();
  }, [id, navigate]);

  // จัดการ input แบบ generic
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // จัดการ Select dropdown
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
    return true;
  };

  // บันทึกการแก้ไข
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      // ตัด id, created_at ออก + trim
      const { id: _, created_at: __, ...rawUpdates } = formData as any;
      const updates = Object.fromEntries(
        Object.entries(rawUpdates).map(([key, val]) => [
          key,
          typeof val === "string" ? (val as string).trim() : val,
        ]),
      );

      const { error } = await supabase
        .from("production_works")
        .update(updates)
        .eq("id", id);

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
            description: "Failed to update production work. Please try again.",
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Production work updated successfully!",
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

  // แสดง spinner ขณะโหลดข้อมูล
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/production")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Production Work</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* — ชื่อผลงาน — */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (EN)</Label>
                <Input
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Title (TH)</Label>
                <Input
                  name="title_th"
                  value={formData.title_th}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* — หมวดหมู่ — */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
              />
            </div>

            {/* — ประเภทสื่อ & Featured — */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Media Type</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(val) => handleSelectChange("media_type", val)}
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
                  value={formData.featured ? "true" : "false"}
                  onValueChange={(val) =>
                    setFormData({ ...formData, featured: val === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* — Media URL — */}
            <div className="space-y-2">
              <Label>Media URL</Label>
              <Input
                name="media_url"
                value={formData.media_url || ""}
                onChange={handleChange}
              />
            </div>

            {/* — Thumbnail (ImageUpload) — */}
            <ImageUpload
              value={formData.thumbnail_url || ""}
              onChange={(url) =>
                setFormData({ ...formData, thumbnail_url: url })
              }
              label="Thumbnail Image (Cover)"
            />

            {/* — คำอธิบายสั้น — */}
            <div className="space-y-2">
              <Label>Short Desc (EN)</Label>
              <Textarea
                name="short_desc_en"
                value={formData.short_desc_en || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Short Desc (TH)</Label>
              <Textarea
                name="short_desc_th"
                value={formData.short_desc_th || ""}
                onChange={handleChange}
              />
            </div>

            {/* — ปุ่มบันทึก — */}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}{" "}
              Update Work
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
