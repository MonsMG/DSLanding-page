/**
 * ✏️ EditGear — ฟอร์มแก้ไขข้อมูลอุปกรณ์ Production
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
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";

export default function EditGear() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ ID จาก URL (เช่น /admin/gear/edit/789)
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // โหลดข้อมูลเดิม
  const [isSaving, setIsSaving] = useState(false); // กำลังบันทึก

  // — State ของฟอร์ม —
  const [formData, setFormData] = useState({
    name_en: "",
    name_th: "",
    category: "",
    brand: "",
    model: "",
    image_url: "",
    available: true,
  });

  // ดึงข้อมูลเดิมจาก Supabase
  useEffect(() => {
    const fetchGear = async () => {
      const { data, error } = await supabase
        .from("production_gear")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load gear data.",
        });
        navigate("/production");
      } else {
        setFormData(data); // เติมข้อมูลเดิมลงฟอร์ม
        setIsLoading(false);
      }
    };
    fetchGear();
  }, [id, navigate]);

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
    return true;
  };

  // บันทึกการแก้ไข
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      // ตัด id, created_at ออก + trim ทุก field
      const { id: _, created_at: __, ...rawUpdates } = formData as any;
      const updates = Object.fromEntries(
        Object.entries(rawUpdates).map(([key, val]) => [
          key,
          typeof val === "string" ? (val as string).trim() : val,
        ]),
      );

      const { error } = await supabase
        .from("production_gear")
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
            description: "Failed to update gear. Please try again.",
          });
        }
        return;
      }

      toast({ title: "Success", description: "Gear updated successfully!" });
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
        </Button>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-8 pt-8 px-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-[hsl(var(--ds-chocolate))]">
              Edit Gear
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* — อัปโหลดรูปอุปกรณ์ — */}
              <ImageUpload
                value={formData.image_url || ""}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Gear Photo"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Name (EN)
                  </Label>
                  <Input
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Name (TH)
                  </Label>
                  <Input
                    name="name_th"
                    value={formData.name_th}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Category
                  </Label>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Brand
                  </Label>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                  Model
                </Label>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                />
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
                  Update Gear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
