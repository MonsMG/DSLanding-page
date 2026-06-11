-- ============================================================
-- DSLanding — Setup สำหรับ Supabase Cloud (รันใน SQL Editor บน Dashboard)
-- ------------------------------------------------------------
-- Idempotent: รันซ้ำได้ ไม่ทำลายข้อมูลเดิม
-- ครอบคลุม: ตาราง flat ทั้ง 7 + is_admin() + RLS + storage policies + seed หมวดหมู่
-- หลังรัน: ตั้ง role admin ให้บัญชีของคุณ (ดู STEP สุดท้ายล่างสุด)
-- ============================================================

-- ---------- 1) ตาราง ----------
CREATE TABLE IF NOT EXISTS public.software_projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  title_en      text NOT NULL,
  title_th      text NOT NULL,
  short_desc_en text, short_desc_th text,
  full_desc_en  text, full_desc_th  text,
  target_en     text, target_th     text,
  features_en   text, features_th   text,
  url           text,
  image_url     text,
  category      text,
  status        text DEFAULT 'Active',
  featured_slot smallint
);

CREATE TABLE IF NOT EXISTS public.software_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.production_works (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  title_en      text NOT NULL,
  title_th      text NOT NULL,
  short_desc_en text, short_desc_th text,
  full_desc_en  text, full_desc_th  text,
  media_type    text NOT NULL DEFAULT 'video',
  media_url     text,
  thumbnail_url text,
  category      text,
  featured      boolean DEFAULT false,
  year          integer,
  client        text,
  tags          text[]
);

CREATE TABLE IF NOT EXISTS public.production_behind_scenes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  title_en       text, title_th text,
  description_en text, description_th text,
  image_url      text,
  sort_order     integer
);

CREATE TABLE IF NOT EXISTS public.production_gear (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_th       text NOT NULL,
  name_en       text,
  category      text,
  image_url     text,
  short_desc_en text, short_desc_th text,
  full_desc_en  text, full_desc_th  text,
  brand         text,
  model         text,
  specs         text,
  available     boolean DEFAULT true,
  rental_price  numeric
);

CREATE TABLE IF NOT EXISTS public."company_generalInfo" (
  id                integer PRIMARY KEY DEFAULT 1,
  name              text,
  about_en          text, about_th   text,
  address_en        text, address_th text,
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

CREATE TABLE IF NOT EXISTS public.about (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_image_url text,
  cv_pdf_url        text,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------- 2) Seed ขั้นต่ำ ----------
INSERT INTO public.software_categories (name) VALUES
  ('Web App'), ('Mobile App'), ('Desktop App'),
  ('API / Backend'), ('AI / ML'), ('Library / Tool')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public."company_generalInfo" (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ---------- 3) Helper: เช็ค admin จาก JWT ----------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ---------- 4) RLS: public อ่านได้ / เขียนเฉพาะ admin ----------
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'software_projects','software_categories','production_works',
    'production_behind_scenes','production_gear','company_generalInfo','about'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);

    EXECUTE format('DROP POLICY IF EXISTS public_read  ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_insert ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_update ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_delete ON public.%I;', t);

    EXECUTE format('CREATE POLICY public_read  ON public.%I FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY admin_insert ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin());', t);
    EXECUTE format('CREATE POLICY admin_update ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', t);
    EXECUTE format('CREATE POLICY admin_delete ON public.%I FOR DELETE TO authenticated USING (public.is_admin());', t);
  END LOOP;
END $$;

-- ---------- 5) Storage: bucket + policies ----------
-- สร้าง bucket 'images' (public) ถ้ายังไม่มี
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS public_read_project_buckets ON storage.objects;
CREATE POLICY public_read_project_buckets ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS admin_insert_objects ON storage.objects;
DROP POLICY IF EXISTS admin_update_objects ON storage.objects;
DROP POLICY IF EXISTS admin_delete_objects ON storage.objects;
CREATE POLICY admin_insert_objects ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images' AND public.is_admin());
CREATE POLICY admin_update_objects ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'images' AND public.is_admin())
  WITH CHECK (bucket_id = 'images' AND public.is_admin());
CREATE POLICY admin_delete_objects ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'images' AND public.is_admin());

-- ============================================================
-- STEP สุดท้าย (ทำหลังสมัครบัญชี admin บน cloud แล้ว):
-- ตั้ง role admin — แก้อีเมลเป็นของคุณ แล้วรันบรรทัดนี้
-- ============================================================
-- UPDATE auth.users
--   SET raw_app_meta_data = COALESCE(raw_app_meta_data,'{}'::jsonb) || '{"role":"admin"}'::jsonb
-- WHERE email = 'admin@dslab.com';
