--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_image_url text,
    cv_pdf_url text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: company_generalInfo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."company_generalInfo" (
    id integer DEFAULT 1 NOT NULL,
    name text,
    about_en text,
    about_th text,
    address_en text,
    address_th text,
    contact_email text,
    contact_phone text,
    facebook_url text,
    instagram_url text,
    youtube_url text,
    line_url text,
    logo_url text,
    cover_url text,
    genetal_image_url text,
    company_pdf_url text,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: production_behind_scenes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.production_behind_scenes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title_en text,
    title_th text,
    description_en text,
    description_th text,
    image_url text,
    sort_order integer
);


--
-- Name: production_gear; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.production_gear (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name_th text NOT NULL,
    name_en text,
    category text,
    image_url text,
    short_desc_en text,
    short_desc_th text,
    full_desc_en text,
    full_desc_th text,
    brand text,
    model text,
    specs text,
    available boolean DEFAULT true,
    rental_price numeric
);


--
-- Name: production_works; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.production_works (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title_en text NOT NULL,
    title_th text NOT NULL,
    short_desc_en text,
    short_desc_th text,
    full_desc_en text,
    full_desc_th text,
    media_type text DEFAULT 'video'::text NOT NULL,
    media_url text,
    thumbnail_url text,
    category text,
    featured boolean DEFAULT false,
    year integer,
    client text,
    tags text[]
);


--
-- Name: software_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.software_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: software_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.software_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title_en text,
    title_th text,
    short_desc_en text,
    short_desc_th text,
    full_desc_en text,
    full_desc_th text,
    target_en text,
    target_th text,
    features_en text,
    features_th text,
    url text,
    image_url text,
    category text,
    status text DEFAULT 'Active'::text,
    featured_slot smallint
);


--
-- Name: about about_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about
    ADD CONSTRAINT about_pkey PRIMARY KEY (id);


--
-- Name: company_generalInfo company_generalInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."company_generalInfo"
    ADD CONSTRAINT "company_generalInfo_pkey" PRIMARY KEY (id);


--
-- Name: production_behind_scenes production_behind_scenes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_behind_scenes
    ADD CONSTRAINT production_behind_scenes_pkey PRIMARY KEY (id);


--
-- Name: production_gear production_gear_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_gear
    ADD CONSTRAINT production_gear_pkey PRIMARY KEY (id);


--
-- Name: production_works production_works_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_works
    ADD CONSTRAINT production_works_pkey PRIMARY KEY (id);


--
-- Name: software_categories software_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_categories
    ADD CONSTRAINT software_categories_name_key UNIQUE (name);


--
-- Name: software_categories software_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_categories
    ADD CONSTRAINT software_categories_pkey PRIMARY KEY (id);


--
-- Name: software_projects software_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_projects
    ADD CONSTRAINT software_projects_pkey PRIMARY KEY (id);


--
-- Name: about trg_about_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_about_updated_at BEFORE UPDATE ON public.about FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: about; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

--
-- Name: about admin_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_delete ON public.about FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: company_generalInfo admin_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_delete ON public."company_generalInfo" FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: production_behind_scenes admin_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_delete ON public.production_behind_scenes FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: production_gear admin_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_delete ON public.production_gear FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: production_works admin_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_delete ON public.production_works FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: software_categories admin_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_delete ON public.software_categories FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: software_projects admin_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_delete ON public.software_projects FOR DELETE TO authenticated USING (public.is_admin());


--
-- Name: about admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_insert ON public.about FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: company_generalInfo admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_insert ON public."company_generalInfo" FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: production_behind_scenes admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_insert ON public.production_behind_scenes FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: production_gear admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_insert ON public.production_gear FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: production_works admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_insert ON public.production_works FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: software_categories admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_insert ON public.software_categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: software_projects admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_insert ON public.software_projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());


--
-- Name: about admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_update ON public.about FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: company_generalInfo admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_update ON public."company_generalInfo" FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: production_behind_scenes admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_update ON public.production_behind_scenes FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: production_gear admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_update ON public.production_gear FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: production_works admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_update ON public.production_works FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: software_categories admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_update ON public.software_categories FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: software_projects admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_update ON public.software_projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: company_generalInfo; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public."company_generalInfo" ENABLE ROW LEVEL SECURITY;

--
-- Name: production_behind_scenes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.production_behind_scenes ENABLE ROW LEVEL SECURITY;

--
-- Name: production_gear; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.production_gear ENABLE ROW LEVEL SECURITY;

--
-- Name: production_works; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.production_works ENABLE ROW LEVEL SECURITY;

--
-- Name: company_generalInfo public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read ON public."company_generalInfo" FOR SELECT USING (true);


--
-- Name: production_behind_scenes public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read ON public.production_behind_scenes FOR SELECT USING (true);


--
-- Name: production_works public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read ON public.production_works FOR SELECT USING (true);


--
-- Name: software_categories public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read ON public.software_categories FOR SELECT USING (true);


--
-- Name: about public_read_about; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read_about ON public.about FOR SELECT USING (true);


--
-- Name: production_gear public_read_production_gear; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read_production_gear ON public.production_gear FOR SELECT USING (true);


--
-- Name: software_projects public_read_software_projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY public_read_software_projects ON public.software_projects FOR SELECT USING (true);


--
-- Name: software_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.software_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: software_projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.software_projects ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

