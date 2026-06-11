/**
 * ✏️ EditBehindScene — ฟอร์มแก้ไขรูป Behind the Scenes
 *
 * การทำงาน:
 *   1. ดึงข้อมูลเดิมจาก Supabase ผ่าน ID ใน URL (useBehindSceneById)
 *   2. แสดงข้อมูลเดิมในฟอร์มให้แก้ไขได้
 *   3. กดบันทึก → validate → update ลง Supabase
 *   4. สำเร็จ → redirect ไปหน้า /production
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useBehindSceneById } from "@/hooks/useBehindScenes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  Loader2,
  Camera,
  Type,
  AlignLeft,
  Hash,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/components/ui/use-toast";

export default function EditBehindScene() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // ดึงข้อมูลเดิม
  const numericId = id ? parseInt(id) : null;
  const { behindScene, loading, error } = useBehindSceneById(numericId);

  // — State ของฟอร์ม —
  const [formData, setFormData] = useState({
    title_en: "",
    title_th: "",
    description_en: "",
    description_th: "",
    image_url: "",
    sort_order: "",
  });

  // เติมข้อมูลเดิมลงฟอร์มเมื่อโหลดเสร็จ
  useEffect(() => {
    if (behindScene) {
      setFormData({
        title_en: behindScene.title_en || "",
        title_th: behindScene.title_th || "",
        description_en: behindScene.description_en || "",
        description_th: behindScene.description_th || "",
        image_url: behindScene.image_url || "",
        sort_order: behindScene.sort_order?.toString() || "",
      });
    }
  }, [behindScene]);

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
    return true;
  };

  // ส่งข้อมูลไป Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving || !numericId) return;

    setIsSaving(true);
    try {
      const payload = {
        title_en: formData.title_en.trim(),
        title_th: formData.title_th.trim(),
        description_en: formData.description_en.trim() || null,
        description_th: formData.description_th.trim() || null,
        image_url: formData.image_url || null,
        sort_order: formData.sort_order ? parseInt(formData.sort_order) : null,
      };

      const { error } = await supabase
        .from("production_behind_scenes")
        .update(payload)
        .eq("id", numericId);

      if (error) {
        const isPermission =
          error.code === "42501" ||
          error.message?.toLowerCase().includes("permission");
        toast({
          variant: "destructive",
          title: isPermission ? "Unauthorized" : "Error",
          description: isPermission
            ? "You do not have permission to perform this action."
            : "Failed to update. Please try again.",
        });
        return;
      }

      toast({
        title: "✅ Updated",
        description: "Behind the Scenes updated successfully!",
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

  // — Loading State —
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  // — Error / Not Found State —
  if (error || !behindScene) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center py-16 px-8 bg-white rounded-[2rem] shadow-sm max-w-md w-full">
          <Camera className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[hsl(var(--ds-chocolate))] mb-2">
            Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            ไม่พบข้อมูลที่ต้องการแก้ไข
          </p>
          <Button
            onClick={() => navigate("/production")}
            className="rounded-full px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Production
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-10 px-4">
      {/* Decorative Background */}
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Production
        </Button>

        <Card className="border-0 shadow-[0_8px_40px_rgb(0,0,0,0.06)] rounded-[2rem] overflow-hidden bg-white">
          {/* Card Header */}
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-8 pt-8 px-8 sm:px-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-[hsl(var(--ds-chocolate))]">
                  Edit Behind the Scenes
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  แก้ไขรูปภาพเบื้องหลังการถ่ายทำ
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ── Section: Image Upload ── */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-[hsl(var(--ds-chocolate))]">
                    Photo
                  </h3>
                </div>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  label="Behind the Scenes Image"
                />
              </div>

              {/* ── Section: Title ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-[hsl(var(--ds-chocolate))]">
                    Title / หัวข้อ
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title_en"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Title (EN) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title_en"
                      name="title_en"
                      placeholder="e.g. On Set at Studio B"
                      required
                      value={formData.title_en}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 border-border/60 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="title_th"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Title (TH) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title_th"
                      name="title_th"
                      placeholder="เช่น บนเซ็ตถ่ายทำที่สตูดิโอ B"
                      required
                      value={formData.title_th}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 border-border/60 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section: Description ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-[hsl(var(--ds-chocolate))]">
                    Description / คำอธิบาย{" "}
                    <span className="text-muted-foreground font-normal text-sm">
                      (optional)
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="description_en"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Description (EN)
                    </Label>
                    <Textarea
                      id="description_en"
                      name="description_en"
                      placeholder="Brief description of what's happening..."
                      value={formData.description_en}
                      onChange={handleChange}
                      className="rounded-xl bg-white/50 border-border/60 focus:bg-white transition-colors resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="description_th"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Description (TH)
                    </Label>
                    <Textarea
                      id="description_th"
                      name="description_th"
                      placeholder="คำอธิบายสั้นๆ เกี่ยวกับภาพนี้..."
                      value={formData.description_th}
                      onChange={handleChange}
                      className="rounded-xl bg-white/50 border-border/60 focus:bg-white transition-colors resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* ── Section: Sort Order ── */}
              <div className="space-y-2 pb-2 border-t border-border/30 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-[hsl(var(--ds-chocolate))]">
                    Sort Order{" "}
                    <span className="text-muted-foreground font-normal text-sm">
                      (optional — เลขน้อยจะแสดงก่อน)
                    </span>
                  </h3>
                </div>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  min="0"
                  placeholder="เช่น 1, 2, 3 ..."
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-white/50 border-border/60 focus:bg-white transition-colors max-w-xs"
                />
              </div>

              {/* ── Submit Button ── */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-14 shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] transition-all duration-300 rounded-[20px] text-lg font-medium tracking-wide"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  ) : (
                    <Save className="mr-2 h-5 w-5" />
                  )}
                  {isSaving ? "Saving..." : "Update Behind the Scenes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
