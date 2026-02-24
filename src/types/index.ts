// ==============================
// 🎯 Software Projects
// ==============================
export interface SoftwareProject {
  id: number;
  created_at: string;

  // ข้อมูลภาษาอังกฤษ
  title_en: string;
  short_desc_en: string;
  full_desc_en?: string;
  target_en?: string;
  features_en?: string;

  // ข้อมูลภาษาไทย
  title_th: string;
  short_desc_th: string;
  full_desc_th?: string;
  target_th?: string;
  features_th?: string;

  // Metadata
  url?: string;
  image_url?: string;
  category: string;
  status: "Active" | "Maintenance" | "Coming Soon";
  featured_slot?: number; // Slot 1, 2, 3 สำหรับ Featured Projects
}

// ==============================
// 🎬 Production Works
// ==============================
export interface ProductionWork {
  id: number;
  created_at: string;

  // ข้อมูลภาษาอังกฤษ
  title_en: string;
  short_desc_en: string;
  full_desc_en?: string;

  // ข้อมูลภาษาไทย
  title_th: string;
  short_desc_th: string;
  full_desc_th?: string;

  // Media
  media_type: "video" | "image";
  media_url?: string;
  thumbnail_url?: string;

  // Metadata
  category: string; // เช่น "Music Video", "Live Performance", "Corporate Video"
  client?: string;
  featured?: boolean; // สำหรับไฮไลท์งานเด่นๆ
  tags?: string[]; // แท็กสำหรับค้นหา เช่น ["concert", "outdoor", "4K"]
  year?: number;
}

// ==============================
// 🎥 Production Gear
// ==============================
export interface ProductionGear {
  id: number;
  created_at: string;

  // ข้อมูลภาษาอังกฤษ
  name_en: string;
  short_desc_en: string;
  full_desc_en?: string;

  // ข้อมูลภาษาไทย
  name_th: string;
  short_desc_th: string;
  full_desc_th?: string;

  // Metadata
  category: string; // เช่น "Camera", "Lens", "Audio", "Lighting", "Grip"
  brand?: string;
  model?: string;
  image_url?: string;
  specs?: string; // รายละเอียดสเปคเทคนิค
  available?: boolean; // พร้อมใช้งานหรือไม่
  rental_price?: number; // ราคาเช่าต่อวัน (ถ้ามี)
}
