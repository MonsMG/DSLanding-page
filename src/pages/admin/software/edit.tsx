/**
 * ✏️ EditSoftware — ฟอร์มแก้ไขโปรเจกต์ Software ที่มีอยู่แล้ว
 *
 * การทำงาน:
 *   1. ดึง ID จาก URL params → fetch ข้อมูลจาก Supabase
 *   2. เติมข้อมูลเดิมลงใน form fields
 *   3. เปลี่ยนรูปใหม่ → อัปโหลด -> ลบรูปเก่า -> บันทึก URL ใหม่
 *   4. สำเร็จ → redirect กลับไปหน้า /software
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
import { Loader2, ArrowLeft, Save, Plus, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditSoftware() {
  const navigate = useNavigate();
  const { id } = useParams(); // รับ ID โปรเจกต์จาก URL (เช่น /admin/software/edit/123)
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true); // โหลดข้อมูลเดิม
  const [isSaving, setIsSaving] = useState(false); // กำลังบันทึก
  const [categories, setCategories] = useState<string[]>([]);

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

  const [targetsEn, setTargetsEn] = useState<string[]>([""]);
  const [featuresEn, setFeaturesEn] = useState<string[]>([""]);

  const handleDynamicChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    setter((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  const addDynamicField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const removeDynamicField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

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
          title: "Error loading project details",
        });
        navigate("/software");
      } else {
        setFormData(data); // เติมข้อมูลเดิมลงฟอร์ม
        if (data.target_en) {
          setTargetsEn(data.target_en.split("\n"));
        } else {
          setTargetsEn([""]);
        }
        if (data.features_en) {
          setFeaturesEn(data.features_en.split("\n"));
        } else {
          setFeaturesEn([""]);
        }
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("software_categories")
          .select("name")
          .order("name", { ascending: true });

        if (!error && data) {
          setCategories(data.map((item) => item.name));
        }
      } catch (err: unknown) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProject();
    fetchCategories();
  }, [id, navigate, toast]);

  // จัดการ input แบบ generic
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      const {
        id: _,
        created_at: __,
        ...rawUpdates
      } = formData as unknown as {
        id: string;
        created_at: string;
        [key: string]: unknown;
      };
      const updates = Object.fromEntries(
        Object.entries(rawUpdates).map(([key, val]) => [
          key,
          typeof val === "string" ? (val as string).trim() : val,
        ]),
      );

      updates.target_en = targetsEn.filter((t) => t.trim() !== "").join("\n");
      updates.features_en = featuresEn
        .filter((f) => f.trim() !== "")
        .join("\n");

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
      navigate("/software");
    } catch (err: unknown) {
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
          onClick={() => navigate("/software")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
        </Button>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-8 pt-8 px-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-[hsl(var(--ds-chocolate))]">
              Edit Software Project
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* — ชื่อโปรเจกต์ — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Software Name (EN)
                  </Label>
                  <Input
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Software Name (TH)
                  </Label>
                  <Input
                    name="title_th"
                    value={formData.title_th}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* — คำอธิบายสั้น — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Short Desc (EN)
                  </Label>
                  <Textarea
                    name="short_desc_en"
                    value={formData.short_desc_en || ""}
                    onChange={handleChange}
                    required
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    rows={3}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Short Desc (TH)
                  </Label>
                  <Textarea
                    name="short_desc_th"
                    value={formData.short_desc_th || ""}
                    onChange={handleChange}
                    required
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* — หมวดหมู่ & สถานะ — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Category
                  </Label>
                  <Input
                    name="category"
                    list="category-options"
                    placeholder="Type to search or select..."
                    value={formData.category || ""}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                  <datalist id="category-options">
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                  Project URL
                </Label>
                <Input
                  name="url"
                  value={formData.url || ""}
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                />
              </div>

              {/* — อัปโหลดภาพปก — */}
              <ImageUpload
                value={formData.image_url || ""}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Cover Image"
              />

              {/* — คำอธิบายเต็ม — */}
              <div className="space-y-3 border-t border-primary/10 pt-8 mt-4">
                <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                  Full Description (EN)
                </Label>
                <Textarea
                  name="full_desc_en"
                  value={formData.full_desc_en || ""}
                  onChange={handleChange}
                  rows={5}
                  className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* — กลุ่มเป้าหมาย & ฟีเจอร์ — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-primary/10 pt-8 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Target Audience (EN)
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addDynamicField(setTargetsEn)}
                      className="text-[hsl(var(--ds-red-orange))] hover:bg-[hsl(var(--ds-red-orange))]/10 h-8 px-2"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {targetsEn.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            handleDynamicChange(
                              setTargetsEn,
                              index,
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Student"
                          className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeDynamicField(setTargetsEn, index)
                          }
                          className="text-muted-foreground hover:text-destructive flex-shrink-0 h-10 w-10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Key Features (EN)
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addDynamicField(setFeaturesEn)}
                      className="text-[hsl(var(--ds-red-orange))] hover:bg-[hsl(var(--ds-red-orange))]/10 h-8 px-2"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {featuresEn.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            handleDynamicChange(
                              setFeaturesEn,
                              index,
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Real-time sync"
                          className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeDynamicField(setFeaturesEn, index)
                          }
                          className="text-muted-foreground hover:text-destructive flex-shrink-0 h-10 w-10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* — ปุ่มบันทึก — */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] transition-all duration-300 rounded-[20px] text-lg font-medium tracking-wide"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-5 w-5" />
                  )}
                  Update Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
