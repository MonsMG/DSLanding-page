// src/types/portfolio.ts
// เหลือเฉพาะ type ที่ยังถูกใช้จริง (ตาราง about) —
// โมเดล normalized เดิม (Production/ProductionMedia ฯลฯ) ถูกถอดออกพร้อม schema เก่า
// โมเดลหลักของแอปอยู่ที่ src/types/index.ts

export interface AboutConfig {
  id: string;
  profile_image_url?: string;
  cv_pdf_url?: string;
  updated_at: string;
}
