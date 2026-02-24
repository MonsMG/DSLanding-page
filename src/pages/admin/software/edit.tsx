/**
 * ✏️ EditSoftware — ฟอร์มแก้ไขโปรเจกต์ Software ที่มีอยู่แล้ว
 *
 * การทำงาน:
 *   1. ดึง ID จาก URL params → fetch ข้อมูลจาก Supabase
 *   2. เติมข้อมูลเดิมลงใน form fields
 *   3. User แก้ไข → กดบันทึก → validate → trim → update Supabase
 *   4. สำเร็จ → redirect กลับไปหน้า /it
 *
 * ความปลอดภัย:
 *   - ตัด id, created_at ออกก่อน update (ป้องกัน overwrite metadata)
 *   - ป้องกัน double submit ด้วย isSaving guard
 *   - ตรวจสอบ RLS error → แจ้ง "Unauthorized"
 *   - ใช้ toast แทน alert (ไม่ leak error details)
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function EditSoftware() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ ID โปรเจกต์จาก URL (เช่น /admin/software/edit/123)
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // โหลดข้อมูลเดิม
  const [isSaving, setIsSaving] = useState(false); // กำลังบันทึก

  // — State ของฟอร์ม —
  const [formData, setFormData] = useState({
    title_en: "",
    title_th: "",
    short_desc_en: "",
    short_desc_th: "",
    full_desc_en: "",
    full_desc_th: "",
    target_en: "",
    target_th: "",
    features_en: "",
    features_th: "",
    url: "",
    image_url: "",
    category: "",
    status: "Active",
  });

  // ดึงข้อมูลเดิมจาก Supabase มาเติมในฟอร์ม
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("software_projects")
        .select("*")
        .eq("id", id)
        .single(); // ดึงแค่ 1 row

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load project data.",
        });
        navigate("/it");
      } else {
        setFormData(data); // เติมข้อมูลเดิมลงฟอร์ม
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  // จัดการ input แบบ generic
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (!formData.short_desc_en?.trim() || !formData.short_desc_th?.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Short descriptions are required.",
      });
      return false;
    }
    return true;
  };

  // บันทึกการแก้ไข (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      // ตัด id และ created_at ออก (ไม่ควรส่งไป update)
      // แล้ว trim ข้อมูลทุก field
      const { id: _, created_at: __, ...rawUpdates } = formData as any;
      const updates = Object.fromEntries(
        Object.entries(rawUpdates).map(([key, val]) => [
          key,
          typeof val === "string" ? (val as string).trim() : val,
        ]),
      );

      const { error } = await supabase
        .from("software_projects")
        .update(updates) // .update() ≠ .insert()
        .eq("id", id); // ระบุแถวที่จะแก้ไข

      if (error) {
        // เช็ค RLS Permission Error
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
            description: "Failed to update project. Please try again.",
          });
        }
        return;
      }

      toast({ title: "Success", description: "Project updated successfully!" });
      navigate("/it");
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
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/it")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Edit Software Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* — ชื่อโปรเจกต์ — */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* — คำอธิบายสั้น — */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Short Desc (EN)</Label>
                <Textarea
                  name="short_desc_en"
                  value={formData.short_desc_en || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Short Desc (TH)</Label>
                <Textarea
                  name="short_desc_th"
                  value={formData.short_desc_th || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* — หมวดหมู่ & URL — */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Project URL</Label>
              <Input
                name="url"
                value={formData.url || ""}
                onChange={handleChange}
              />
            </div>

            {/* — อัปโหลดภาพปก — */}
            <ImageUpload
              value={formData.image_url || ""}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Cover Image"
            />

            {/* — คำอธิบายเต็ม — */}
            <div className="space-y-2 border-t pt-4">
              <Label>Full Description (EN)</Label>
              <Textarea
                name="full_desc_en"
                value={formData.full_desc_en || ""}
                onChange={handleChange}
                rows={5}
              />
            </div>

            {/* — ปุ่มบันทึก — */}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Update Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
