-- ============================================================
-- RLS Write Policies — Admin only
-- ------------------------------------------------------------
-- สถานะเดิม: ทุกตารางเปิด RLS แล้ว และมี policy "public read" (SELECT) อยู่
--            แต่ไม่มี policy สำหรับ INSERT/UPDATE/DELETE เลย
--            => RLS default-deny ทำให้ "เขียนอะไรไม่ได้เลย" แม้แต่ admin
--
-- ไฟล์นี้เพิ่ม policy เขียน (INSERT/UPDATE/DELETE) ให้เฉพาะ "admin" เท่านั้น
-- โดยนิยาม admin = JWT claim app_metadata.role = 'admin'
-- (ตั้งค่าฝั่ง server เท่านั้น ผู้ใช้ทั่วไปยกระดับตัวเองไม่ได้)
--
-- วิธีตั้งให้บัญชีเป็น admin (รันครั้งเดียวต่อ user ผ่าน psql / service_role):
--   UPDATE auth.users
--      SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
--    WHERE email = 'you@example.com';
-- ============================================================

-- Helper: เช็คว่า request ปัจจุบันมาจาก admin หรือไม่
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- สร้าง policy INSERT/UPDATE/DELETE (admin-only) ให้ทุกตาราง
-- public read policy เดิมคงไว้ ไม่แตะ
--
-- ⚠️ ส่วน DO block ด้านล่างต้องรันในฐานะ "เจ้าของตาราง" (supabase_admin)
--    เพราะ postgres ใน self-hosted ไม่ใช่ owner:
--      docker exec -i supabase-db psql -U supabase_admin -d postgres < rls_policies.sql
--    (CREATE FUNCTION ด้านบนรันด้วย postgres ได้ปกติ)
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'productions',
    'production_media',
    'behind_the_scenes',
    'production_gear',
    'production_gear_used',
    'software_projects',
    'about'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS admin_insert ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_update ON public.%I;', t);
    EXECUTE format('DROP POLICY IF EXISTS admin_delete ON public.%I;', t);

    EXECUTE format(
      'CREATE POLICY admin_insert ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin());', t);
    EXECUTE format(
      'CREATE POLICY admin_update ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', t);
    EXECUTE format(
      'CREATE POLICY admin_delete ON public.%I FOR DELETE TO authenticated USING (public.is_admin());', t);
  END LOOP;
END $$;

-- ============================================================
-- Storage RLS — storage.objects ไม่มี policy มาก่อน (อัปโหลดพังทั้งหมด)
-- public อ่าน bucket ของโปรเจกต์ได้ / เขียน-ลบเฉพาะ admin
-- ⚠️ ต้องรันด้วย supabase_admin (superuser) เพราะ owner คือ supabase_storage_admin
-- ============================================================
DROP POLICY IF EXISTS public_read_project_buckets ON storage.objects;
CREATE POLICY public_read_project_buckets ON storage.objects
  FOR SELECT USING (bucket_id IN ('images','landpages-media'));

DROP POLICY IF EXISTS admin_insert_objects ON storage.objects;
DROP POLICY IF EXISTS admin_update_objects ON storage.objects;
DROP POLICY IF EXISTS admin_delete_objects ON storage.objects;
CREATE POLICY admin_insert_objects ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('images','landpages-media') AND public.is_admin());
CREATE POLICY admin_update_objects ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('images','landpages-media') AND public.is_admin())
  WITH CHECK (bucket_id IN ('images','landpages-media') AND public.is_admin());
CREATE POLICY admin_delete_objects ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('images','landpages-media') AND public.is_admin());
