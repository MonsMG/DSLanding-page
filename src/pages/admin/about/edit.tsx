// src/pages/admin/about/edit.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAbout, upsertAbout } from "@/services/aboutService";
import { uploadFile, deleteFileByUrl } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { VALIDATION, ERROR_MESSAGES } from "@/constants";
import { ArrowLeft, Save, Loader2, FileText, Upload, Trash2 } from "lucide-react";

export default function EditAbout() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: "",
    profile_image_url: "",
    cv_pdf_url: "",
  });

  // Keep track of old URLs to clean up if overwritten or deleted
  const [initialUrls, setInitialUrls] = useState({
    profile_image_url: "",
    cv_pdf_url: "",
  });

  // Load biography configurations on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getAbout();
        if (data) {
          const loaded = {
            id: data.id,
            profile_image_url: data.profile_image_url || "",
            cv_pdf_url: data.cv_pdf_url || "",
          };
          setFormData(loaded);
          setInitialUrls(loaded);
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || ERROR_MESSAGES.FETCH_FAILED,
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  // Handle CV PDF Upload
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];

      setIsPdfUploading(true);

      // Upload file via central storage service
      const publicUrl = await uploadFile(
        file,
        VALIDATION.ALLOWED_PDF_TYPES,
        VALIDATION.MAX_PDF_SIZE
      );

      // Clean up previous PDF file if uploaded during this session
      if (formData.cv_pdf_url && formData.cv_pdf_url !== initialUrls.cv_pdf_url) {
        await deleteFileByUrl(formData.cv_pdf_url);
      }

      setFormData((prev) => ({ ...prev, cv_pdf_url: publicUrl }));
      toast({
        title: "Success",
        description: "CV PDF uploaded successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.message || ERROR_MESSAGES.UPLOAD_FAILED,
      });
    } finally {
      setIsPdfUploading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  // Remove CV PDF
  const handleRemovePdf = async () => {
    if (!formData.cv_pdf_url) return;
    
    // Only delete file immediately if it was uploaded in the current unsaved session
    if (formData.cv_pdf_url !== initialUrls.cv_pdf_url) {
      await deleteFileByUrl(formData.cv_pdf_url);
    }
    
    setFormData((prev) => ({ ...prev, cv_pdf_url: "" }));
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Clean up old assets if they were replaced
      if (initialUrls.profile_image_url && formData.profile_image_url !== initialUrls.profile_image_url) {
        await deleteFileByUrl(initialUrls.profile_image_url);
      }
      if (initialUrls.cv_pdf_url && formData.cv_pdf_url !== initialUrls.cv_pdf_url) {
        await deleteFileByUrl(initialUrls.cv_pdf_url);
      }

      const result = await upsertAbout({
        profile_image_url: formData.profile_image_url || undefined,
        cv_pdf_url: formData.cv_pdf_url || undefined,
      });

      toast({
        title: "Success",
        description: "Biographical details saved successfully!",
      });

      // Update initial urls to current state
      const updated = {
        id: result.id,
        profile_image_url: result.profile_image_url || "",
        cv_pdf_url: result.cv_pdf_url || "",
      };
      setFormData(updated);
      setInitialUrls(updated);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error Saving",
        description: err.message || ERROR_MESSAGES.SAVE_FAILED,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-10 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container relative z-10 max-w-2xl mx-auto animate-fade-in-up">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="bg-card/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/5 pb-8 pt-8 px-8 sm:px-10">
            <CardTitle className="text-3xl font-bold text-[hsl(var(--ds-chocolate))]">
              Edit Biography Info
            </CardTitle>
            <CardDescription>
              Manage your professional profile photo and Curriculum Vitae PDF document.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 sm:p-10">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Profile Image Section */}
                <div className="space-y-3">
                  <ImageUpload
                    value={formData.profile_image_url}
                    onChange={(url) => setFormData((prev) => ({ ...prev, profile_image_url: url }))}
                    label="Profile Photo"
                  />
                </div>

                {/* 2. CV PDF Document Section */}
                <div className="space-y-4 pt-4 border-t border-primary/10">
                  <Label className="font-semibold text-[hsl(var(--ds-chocolate))] text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    CV Document (PDF)
                  </Label>

                  <input
                    type="file"
                    ref={pdfInputRef}
                    accept="application/pdf"
                    className="hidden"
                    onChange={handlePdfUpload}
                    disabled={isPdfUploading}
                  />

                  {formData.cv_pdf_url ? (
                    <div className="flex items-center justify-between p-4 bg-muted/40 border border-border rounded-xl">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                        <div className="text-sm overflow-hidden">
                          <p className="font-medium text-foreground truncate">
                            Curriculum_Vitae.pdf
                          </p>
                          <a
                            href={formData.cv_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            View document
                          </a>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={handleRemovePdf}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      {isPdfUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {isPdfUploading ? "Uploading document..." : "Click to upload Curriculum Vitae PDF"}
                      </span>
                      <span className="text-xs text-muted-foreground/60 mt-1">
                        PDF — max 10MB
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Action Save Button */}
                <div className="pt-6 border-t border-primary/10">
                  <Button
                    type="submit"
                    className="w-full h-14 shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:shadow-[0_8px_40px_rgb(222,49,99,0.5)] transition-all duration-300 rounded-[20px] text-lg font-medium tracking-wide"
                    disabled={isSaving || isPdfUploading}
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <Save className="mr-2 h-5 w-5" />
                    )}{" "}
                    Save Settings
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
