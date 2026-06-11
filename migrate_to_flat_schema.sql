-- ============================================================
-- Migrate DB → "flat schema" ให้ตรงกับที่ frontend ใช้จริง (types/index.ts)
-- ------------------------------------------------------------
-- บริบท: DB เดิมเป็น normalized (productions/production_media/behind_the_scenes/
--        production_gear_used) แต่โค้ดหน้าเว็บอ่าน flat (production_works,
--        production_behind_scenes, software_projects rich, company_generalInfo)
--        ไฟล์นี้ย้ายข้อมูลเท่าที่ทำได้ แล้วรื้อตาราง normalized ที่ไม่ใช้
--
-- ⚠️ ต้องรันในฐานะเจ้าของตาราง (supabase_admin):
--    docker exec -i supabase-db psql -U supabase_admin -d postgres < migrate_to_flat_schema.sql
-- ============================================================

BEGIN;

-- ============================================================
-- 1) software_projects → rich (เพิ่มคอลัมน์ + ย้ายข้อมูล 3 แถวเดิม + ทิ้ง minimal)
-- ============================================================
ALTER TABLE public.software_projects
  ADD COLUMN IF NOT EXISTS title_en      text,
  ADD COLUMN IF NOT EXISTS title_th      text,
  ADD COLUMN IF NOT EXISTS short_desc_en text,
  ADD COLUMN IF NOT EXISTS short_desc_th text,
  ADD COLUMN IF NOT EXISTS full_desc_en  text,
  ADD COLUMN IF NOT EXISTS full_desc_th  text,
  ADD COLUMN IF NOT EXISTS target_en     text,
  ADD COLUMN IF NOT EXISTS target_th     text,
  ADD COLUMN IF NOT EXISTS features_en   text,
  ADD COLUMN IF NOT EXISTS features_th   text,
  ADD COLUMN IF NOT EXISTS url           text,
  ADD COLUMN IF NOT EXISTS image_url     text,
  ADD COLUMN IF NOT EXISTS category      text,
  ADD COLUMN IF NOT EXISTS status        text DEFAULT 'Active',
  ADD COLUMN IF NOT EXISTS featured_slot smallint;

-- ย้ายข้อมูลเดิม (name/description/link_url/cover_image_url → ฟิลด์ rich)
UPDATE public.software_projects SET
  title_en      = COALESCE(title_en, name),
  title_th      = COALESCE(title_th, name),
  short_desc_en = COALESCE(short_desc_en, description),
  short_desc_th = COALESCE(short_desc_th, description),
  url           = COALESCE(url, link_url),
  image_url     = COALESCE(image_url, cover_image_url),
  status        = COALESCE(status, 'Active');

-- ทิ้งคอลัมน์ minimal ที่ไม่ใช้แล้ว
ALTER TABLE public.software_projects
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS link_url,
  DROP COLUMN IF EXISTS cover_image_url;

-- ============================================================
-- 2) software_categories (ตารางใหม่ — สำหรับ dropdown หมวดหมู่)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.software_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.software_categories (name) VALUES
  ('Web App'), ('Mobile App'), ('Desktop App'),
  ('API / Backend'), ('AI / ML'), ('Library / Tool')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 3) production_gear → เพิ่มคอลัมน์ rich (ตารางมีอยู่แล้ว)
-- ============================================================
ALTER TABLE public.production_gear
  ADD COLUMN IF NOT EXISTS short_desc_en text,
  ADD COLUMN IF NOT EXISTS short_desc_th text,
  ADD COLUMN IF NOT EXISTS full_desc_en  text,
  ADD COLUMN IF NOT EXISTS full_desc_th  text,
  ADD COLUMN IF NOT EXISTS brand         text,
  ADD COLUMN IF NOT EXISTS model         text,
  ADD COLUMN IF NOT EXISTS specs         text,
  ADD COLUMN IF NOT EXISTS available     boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS rental_price  numeric;

-- ============================================================
-- 4) production_works (ตารางใหม่ flat) + ย้ายข้อมูลจาก productions + media
-- ============================================================
CREATE TABLE IF NOT EXISTS public.production_works (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  title_en      text NOT NULL,
  title_th      text NOT NULL,
  short_desc_en text,
  short_desc_th text,
  full_desc_en  text,
  full_desc_th  text,
  media_type    text NOT NULL DEFAULT 'video',
  media_url     text,
  thumbnail_url text,
  category      text,
  featured      boolean DEFAULT false,
  year          integer,
  client        text,
  tags          text[]
);

INSERT INTO public.production_works
  (id, created_at, title_en, title_th, short_desc_en, short_desc_th,
   category, media_type, media_url, thumbnail_url)
SELECT
  p.id, p.created_at,
  COALESCE(p.title_en, p.title_th), p.title_th,
  p.description_en, p.description_th, p.category,
  COALESCE(m.media_type, 'video'), m.url, m.thumbnail_url
FROM public.productions p
LEFT JOIN LATERAL (
  SELECT media_type, url, thumbnail_url
  FROM public.production_media pm
  WHERE pm.production_id = p.id
  ORDER BY sort_order
  LIMIT 1
) m ON true
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5) production_behind_scenes (ตารางใหม่ flat) + ย้ายข้อมูลเท่าที่ได้
-- ============================================================
CREATE TABLE IF NOT EXISTS public.production_behind_scenes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  title_en       text,
  title_th       text,
  description_en text,
  description_th text,
  image_url      text,
  sort_order     integer
);

INSERT INTO public.production_behind_scenes (id, image_url, sort_order)
SELECT id, url, sort_order FROM public.behind_the_scenes
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6) company_generalInfo (ตารางใหม่ single-row config)
-- ============================================================
CREATE TABLE IF NOT EXISTS public."company_generalInfo" (
  id                integer PRIMARY KEY DEFAULT 1,
  name              text,
  about_en          text,
  about_th          text,
  address_en        text,
  address_th        text,
  contact_email     text,
  contact_phone     text,
  facebook_url      text,
  instagram_url     text,
  youtube_url       text,
  line_url          text,
  logo_url          text,
  cover_url         text,
  genetal_image_url text,
  company_pdf_url   text,
  updated_at        timestamptz DEFAULT now()
);

INSERT INTO public."company_generalInfo" (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7) GRANTs + RLS + Policies สำหรับตารางใหม่ทั้งหมด
--    (public read + admin write; ใช้ helper public.is_admin())
-- ============================================================
DO $$
DECLARE
  t text;
  newtables text[] := ARRAY[
    'production_works',
    'production_behind_scenes',
    'software_categories',
    'company_generalInfo'
  ];
BEGIN
  FOREACH t IN ARRAY newtables
  LOOP
    EXECUTE format('GRANT ALL ON TABLE public.%I TO anon, authenticated, service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);

    EXECUTE format('DROP POLICY IF EXISTS public_read ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_insert ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_update ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_delete ON public.%I;', t);

    EXECUTE format('CREATE POLICY public_read ON public.%I FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY admin_insert ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin());', t);
    EXECUTE format('CREATE POLICY admin_update ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', t);
    EXECUTE format('CREATE POLICY admin_delete ON public.%I FOR DELETE TO authenticated USING (public.is_admin());', t);
  END LOOP;
END $$;

-- ============================================================
-- 8) รื้อตาราง normalized ที่ไม่ถูกใช้แล้ว (ย้ายข้อมูลไปข้างบนแล้ว)
--    หมายเหตุ: เก็บ "about" ไว้ เพราะหน้า admin/about ยังใช้
-- ============================================================
DROP TABLE IF EXISTS public.production_gear_used CASCADE;
DROP TABLE IF EXISTS public.production_media     CASCADE;
DROP TABLE IF EXISTS public.behind_the_scenes    CASCADE;
DROP TABLE IF EXISTS public.productions          CASCADE;

COMMIT;
