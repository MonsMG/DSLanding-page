/**
 * 🏢 Company General Info Management
 *
 * การทำงาน:
 *   1. ดึงข้อมูลจาก `company_generalInfo` (ลิมิต 1 แถว)
 *   2. กำหนดให้ Admin แก้ไขข้อมูลต่างๆ รวมถึงอัปโหลดโลโก้และรูปหน้าปก
 *   3. บันทึกข้อมูลกลับด้วย upsert
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import type { CompanyGeneralInfo } from "@/types";

export default function AdminCompanyInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<CompanyGeneralInfo>>({
    name: "DS Production House",
    about_en: "",
    about_th: "",
    address_en: "",
    address_th: "",
    contact_email: "",
    contact_phone: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    line_url: "",
    logo_url: "",
    cover_url: "",
  });

  const fetchCompanyInfo = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("company_generalInfo")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 means no rows found, which is fine for the very first time.
        throw error;
      }

      if (data) {
        setFormData(data);
      }
    } catch (err: unknown) {
      console.error("Error fetching company info:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load company info.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // — ดึงข้อมูลบริษัทปัจจุบัน —
  useEffect(() => {
    fetchCompanyInfo();
  }, [fetchCompanyInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Trim string fields
      const cleanData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [
          key,
          typeof val === "string" ? val.trim() : val,
        ]),
      );

      // We either insert a new row or update the existing one
      // If we already fetched an ID, we update that ID.
      // Otherwise, we let Supabase insert
      const { error } = await supabase
        .from("company_generalInfo")
        .upsert(cleanData, { onConflict: "id" })
        .select();

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
            description: "Failed to save company information.",
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Company info saved successfully!",
      });

      // Refresh to get any DB generated fields
      fetchCompanyInfo();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ฟังก์ชันสำหรับกดย้อนกลับ (ป้องกัน Loop / ออกนอกเว็บ)
  const handleGoBack = () => {
    // location.key === "default" แปลว่าหน้านี้คือหน้าแรกที่เพิ่งเปิดแท็บขึ้นมา
    if (location.key !== "default") {
      navigate(-1); // มีประวัติ ให้ถอยหลัง 1 หน้า
    } else {
      navigate("/"); // ไม่มีประวัติ (เปิดลิงก์มาตรงๆ) ให้เด้งกลับหน้า Home แทน
    }
  };
  return (
    <div className="min-h-screen bg-background relative py-10 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto animate-fade-in-up">
        {/* Navigation & Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            Admin Company Info
          </h1>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-8 pt-8 px-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-[hsl(var(--ds-chocolate))]">
              Company General Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* === IDENTIFICATION === */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2">
                  Identification
                </h3>
                <div className="space-y-3">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                    Company Name
                  </Label>
                  <Input
                    name="name"
                    required
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="w-full">
                    <ImageUpload
                      value={formData.logo_url || ""}
                      onChange={(url) =>
                        setFormData({ ...formData, logo_url: url })
                      }
                      label="Company Logo"
                    />
                  </div>
                  <div className="w-full">
                    <ImageUpload
                      value={formData.cover_url || ""}
                      onChange={(url) =>
                        setFormData({ ...formData, cover_url: url })
                      }
                      label="Cover Image"
                    />
                  </div>
                </div>
              </div>

              {/* === ABOUT US === */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2">
                  About Us
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      About (EN)
                    </Label>
                    <Textarea
                      name="about_en"
                      rows={4}
                      value={formData.about_en || ""}
                      onChange={handleChange}
                      className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      About (TH)
                    </Label>
                    <Textarea
                      name="about_th"
                      rows={4}
                      value={formData.about_th || ""}
                      onChange={handleChange}
                      className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* === CONTACT & ADDRESS === */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2">
                  Contact & Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Email
                    </Label>
                    <Input
                      name="contact_email"
                      type="email"
                      value={formData.contact_email || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Phone Number
                    </Label>
                    <Input
                      name="contact_phone"
                      value={formData.contact_phone || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Address (EN)
                    </Label>
                    <Textarea
                      name="address_en"
                      rows={3}
                      value={formData.address_en || ""}
                      onChange={handleChange}
                      className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Address (TH)
                    </Label>
                    <Textarea
                      name="address_th"
                      rows={3}
                      value={formData.address_th || ""}
                      onChange={handleChange}
                      className="rounded-xl bg-white/50 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* === SOCIAL MEDIA === */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-primary border-b border-border pb-2">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Facebook URL
                    </Label>
                    <Input
                      name="facebook_url"
                      value={formData.facebook_url || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      Instagram URL
                    </Label>
                    <Input
                      name="instagram_url"
                      value={formData.instagram_url || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      YouTube URL
                    </Label>
                    <Input
                      name="youtube_url"
                      value={formData.youtube_url || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base">
                      LINE URL
                    </Label>
                    <Input
                      name="line_url"
                      value={formData.line_url || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl bg-white/50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* === SUBMIT === */}
              <div className="pt-6">
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
                  Save Company Info
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
