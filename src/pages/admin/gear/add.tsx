/**
 * ➕ AddGear — ฟอร์มเพิ่มอุปกรณ์ Production ใหม่
 *
 * การทำงาน:
 *   1. กรอกข้อมูลอุปกรณ์ (ชื่อ, หมวดหมู่, แบรนด์, รุ่น)
 *   2. อัปโหลดรูปอุปกรณ์ผ่าน ImageUpload component
 *   3. กดบันทึก → validate → trim → insert ลง Supabase (table: production_gear)
 *   4. สำเร็จ → redirect ไปหน้า /production
 *
 * ความปลอดภัย:
 *   - ป้องกัน double submit ด้วย isSaving
 *   - ตรวจสอบ RLS error → แจ้ง "Unauthorized"
 *   - ใช้ toast แทน alert
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function AddGear() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // — State ของฟอร์ม (ตรงกับ columns ใน table production_gear) —
  const [formData, setFormData] = useState({
    name_en: "",
    name_th: "",
    category: "Camera", // default: Camera
    brand: "",
    model: "",
    image_url: "", // ← ได้ค่าจาก ImageUpload
    available: true, // พร้อมใช้งาน
  });

  // จัดการ input แบบ generic
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ตรวจสอบข้อมูลก่อนส่ง
  const validateForm = (): boolean => {
    if (!formData.name_en.trim() || !formData.name_th.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name (EN) and Name (TH) are required.",
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
    return true;
  };

  // ส่งข้อมูลไป Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return; // ป้องกันกดซ้ำ

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
        .from("production_gear")
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
            description: "Failed to save gear. Please try again.",
          });
        }
        return;
      }

      toast({ title: "Success", description: "Gear added successfully!" });
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
          <CardTitle>Add New Gear</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* — อัปโหลดรูปอุปกรณ์ — */}
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Gear Photo"
            />

            {/* — ชื่ออุปกรณ์ (EN/TH) — */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (EN)</Label>
                <Input name="name_en" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Name (TH)</Label>
                <Input name="name_th" required onChange={handleChange} />
              </div>
            </div>

            {/* — หมวดหมู่ & แบรนด์ — */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  name="category"
                  placeholder="Camera, Lens, Light"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input
                  name="brand"
                  placeholder="Sony, Canon"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* — รุ่น — */}
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                name="model"
                placeholder="FX6, A7S III"
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
              Save Gear
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
