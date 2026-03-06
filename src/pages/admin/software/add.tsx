/**
 * ➕ AddSoftware — ฟอร์มเพิ่มโปรเจกต์ Software ใหม่
 *
 * การทำงาน:
 *   1. กรอกข้อมูลโปรเจกต์ (ชื่อ, คำอธิบาย, หมวดหมู่, URL)
 *   2. อัปโหลดภาพปกผ่าน ImageUpload component
 *   3. กดบันทึก → validate → trim ข้อมูล → insert ลง Supabase
 *   4. ถ้าสำเร็จ → redirect ไปหน้า /software
 *
 * ความปลอดภัย:
 *   - ป้องกัน double submit ด้วย isSaving guard
 *   - ตรวจสอบ RLS error → แจ้ง "Unauthorized"
 *   - ใช้ toast แทน alert (ไม่ leak ข้อมูล error)
 *   - trim ทุก string ก่อนส่ง
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddSoftware() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // 📌 เพิ่ม useEffect เพื่อดึงข้อมูล category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // ดึงข้อมูลจาก table software_categories
        const { data, error } = await supabase
          .from("software_categories")
          .select("name")
          .order("name", { ascending: true });

        if (error) throw error;

        if (data) {
          // แปลง array of objects เป็น array of strings
          const catNames = data.map((item) => item.name);
          setCategories(catNames);
        }
      } catch (err: unknown) {
        console.error("Error fetching categories:", err);
        // ไม่ต้อง toast error ตรงนี้ก็ได้ หรือจะ toast เบาๆ ก็ได้
      }
    };

    fetchCategories();
  }, []);
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

  // จัดการ input แบบ generic (ทุกช่องใช้ name attribute)
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

      cleanData.target_en = targetsEn.filter((t) => t.trim() !== "").join("\n");
      cleanData.features_en = featuresEn
        .filter((f) => f.trim() !== "")
        .join("\n");

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

      toast({ title: "Success", description: "Project added successfully!" });
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Software Projects
        </Button>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-8 pt-8 px-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-[hsl(var(--ds-chocolate))]">
              Add New Software Project
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* — ชื่อโปรเจกต์ (EN/TH) — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Software Name (EN)
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
                    Software Name (TH)
                  </Label>
                  <Input
                    name="title_th"
                    required
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              {/* — หมวดหมู่ & สถานะ — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 📌 ส่วนของ Category (Searchable Dropdown) */}
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Category
                  </Label>
                  <Input
                    name="category"
                    list="category-options"
                    placeholder="Type to search or select..."
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                  <datalist id="category-options">
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat} />
                    ))}
                  </datalist>
                </div>

                {/* 📌 ส่วนของ Status */}
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
                  placeholder="https://..."
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                />
              </div>

              {/* — อัปโหลดภาพปก (ใช้ ImageUpload แทน text input) — */}
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Cover Image"
              />

              {/* — คำอธิบายสั้น (EN/TH) — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Short Desc (EN)
                  </Label>
                  <Textarea
                    name="short_desc_en"
                    rows={3}
                    required
                    onChange={handleChange}
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Short Desc (TH)
                  </Label>
                  <Textarea
                    name="short_desc_th"
                    rows={3}
                    required
                    onChange={handleChange}
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>

              {/* — คำอธิบายเต็ม (EN/TH) — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-primary/10 pt-8 mt-4">
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Full Desc (EN)
                  </Label>
                  <Textarea
                    name="full_desc_en"
                    rows={5}
                    onChange={handleChange}
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Full Desc (TH)
                  </Label>
                  <Textarea
                    name="full_desc_th"
                    rows={5}
                    onChange={handleChange}
                    className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>

              {/* — กลุ่มเป้าหมาย & ฟีเจอร์ — */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="text-xs text-muted-foreground">
                *สามารถกรอกภาษาไทยได้ในช่องเดียวกัน หรือจะแยกฟิลด์ในอนาคตก็ได้
              </p>

              {/* — ปุ่มบันทึก (disabled ตอนกำลังบันทึก) — */}
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
                  )}
                  Save Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
