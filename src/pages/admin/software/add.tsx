/**
 * ➕ AddSoftware — ฟอร์มเพิ่มโปรเจกต์ Software ใหม่
 *
 * การทำงาน:
 *   1. กรอกข้อมูลโปรเจกต์ (ชื่อ, คำอธิบาย, หมวดหมู่, URL)
 *   2. อัปโหลดภาพปกผ่าน ImageUpload component
 *   3. กดบันทึก → validate → trim ข้อมูล → insert ลง Supabase
 *   4. ถ้าสำเร็จ → redirect ไปหน้า /it
 *
 * ความปลอดภัย:
 *   - ป้องกัน double submit ด้วย isSaving guard
 *   - ตรวจสอบ RLS error → แจ้ง "Unauthorized"
 *   - ใช้ toast แทน alert (ไม่ leak ข้อมูล error)
 *   - trim ทุก string ก่อนส่ง
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function AddSoftware() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // — State ของฟอร์ม (ตรงกับ columns ใน table software_projects) —
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
    image_url: "", // ← ได้ค่าจาก ImageUpload component
    category: "Web App",
    status: "Active",
  });

  // จัดการ input แบบ generic (ทุกช่องใช้ name attribute)
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
    if (!formData.short_desc_en.trim() || !formData.short_desc_th.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Short descriptions are required.",
      });
      return false;
    }
    return true;
  };

  // ส่งข้อมูลไป Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return; // ป้องกันกดซ้ำ

    setIsSaving(true);
    try {
      // Trim ข้อมูลทุก field ที่เป็น string ก่อนส่ง
      const cleanData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [
          key,
          typeof val === "string" ? val.trim() : val,
        ]),
      );

      const { error } = await supabase
        .from("software_projects")
        .insert([cleanData]);

      if (error) {
        // เช็ค RLS Permission Error (code 42501)
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
            description: "Failed to save project. Please try again.",
          });
        }
        return;
      }

      toast({ title: "Success", description: "Project created successfully!" });
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

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/it")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Add New Software Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* — ชื่อโปรเจกต์ (EN/TH) — */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (EN)</Label>
                <Input name="title_en" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Title (TH)</Label>
                <Input name="title_th" required onChange={handleChange} />
              </div>
            </div>

            {/* — ข้อมูลพื้นฐาน — */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  name="category"
                  placeholder="Web App, IoT, AI"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input
                  name="status"
                  placeholder="Active, Maintenance"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Project URL</Label>
                <Input
                  name="url"
                  placeholder="https://..."
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* — อัปโหลดภาพปก (ใช้ ImageUpload แทน text input) — */}
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Cover Image"
            />

            {/* — คำอธิบายสั้น (EN/TH) — */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Short Desc (EN)</Label>
                <Textarea
                  name="short_desc_en"
                  rows={3}
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Short Desc (TH)</Label>
                <Textarea
                  name="short_desc_th"
                  rows={3}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* — คำอธิบายเต็ม (EN/TH) — */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Full Desc (EN)</Label>
                <Textarea
                  name="full_desc_en"
                  rows={5}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Full Desc (TH)</Label>
                <Textarea
                  name="full_desc_th"
                  rows={5}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* — กลุ่มเป้าหมาย & ฟีเจอร์ — */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience (EN)</Label>
                <Textarea
                  name="target_en"
                  placeholder={"- Student\n- Teacher"}
                  rows={4}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Key Features (EN)</Label>
                <Textarea
                  name="features_en"
                  placeholder={"- Feature 1\n- Feature 2"}
                  rows={4}
                  onChange={handleChange}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              *สามารถกรอกภาษาไทยได้ในช่องเดียวกัน หรือจะแยกฟิลด์ในอนาคตก็ได้
            </p>

            {/* — ปุ่มบันทึก (disabled ตอนกำลังบันทึก) — */}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              Save Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
