SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict cyJOYvCofREzu94WFoXi0ZeueUdUCaprK7tTrLYjljtOf46i2GJoIjBuKR9Pshb

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	2343ae50-c66f-4ef7-bd87-07aa49682c7e	authenticated	authenticated	admin@test.com	$2a$10$zqCwWnRtfx5lSXBoo6kUueigzIE3eSr7pIAnsLW9T58dl7Jn8oVzW	2026-02-13 07:55:40.02951+00	\N		\N		\N			\N	2026-03-10 05:57:29.996835+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-02-13 07:55:40.003545+00	2026-03-27 09:37:51.840065+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
2343ae50-c66f-4ef7-bd87-07aa49682c7e	2343ae50-c66f-4ef7-bd87-07aa49682c7e	{"sub": "2343ae50-c66f-4ef7-bd87-07aa49682c7e", "email": "admin@test.com", "email_verified": false, "phone_verified": false}	email	2026-02-13 07:55:40.023564+00	2026-02-13 07:55:40.023623+00	2026-02-13 07:55:40.023623+00	d08bc192-2760-4d4a-9202-f35b8ddd3edd
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_challenges" ("id", "user_id", "challenge_type", "session_data", "created_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_credentials" ("id", "user_id", "credential_id", "public_key", "attestation_type", "aaguid", "sign_count", "transports", "backup_eligible", "backed_up", "friendly_name", "created_at", "updated_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: company_generalInfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."company_generalInfo" ("id", "genetal_image_url", "company_pdf_url", "updated_at", "name", "about_en", "about_th", "address_en", "address_th", "contact_email", "contact_phone", "facebook_url", "instagram_url", "youtube_url", "line_url", "logo_url", "cover_url") FROM stdin;
1			2026-03-04 15:11:24.101136+00													
\.


--
-- Data for Name: production_gear; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."production_gear" ("id", "created_at", "name_en", "name_th", "short_desc_en", "short_desc_th", "category", "brand", "model", "image_url", "available") FROM stdin;
1	2026-02-13 07:03:25.305149+00	Sony FX6	กล้อง Sony FX6	\N	\N	Camera	Sony	FX6	https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80	t
2	2026-02-13 07:03:25.305149+00	DJI Ronin 4D	กิมบอล Ronin 4D	\N	\N	Stabilizer	DJI	Ronin 4D	https://www.ec-mall.com/media/catalog/product/cache/9e060b1b3b357cb140b27d2b51b02644/D/J/DJI-Ronin-4D-8K-1.webp	t
3	2026-02-13 07:03:25.305149+00	Aputure 600d	ไฟสตูดิโอ 600d	\N	\N	Lighting	Aputure	LS 600d	https://c2348e20.delivery.rocketcdn.me/wp-content/uploads/2025/06/Aputure-LS-600d-Pro-LED-Light-V-Mount.png	t
5	2026-02-13 07:03:25.305149+00	Mac Studio	เครื่องตัดต่อ Mac Studio	\N	\N	Editing	Apple	M2 Ultra	https://cdn.mos.cms.futurecdn.net/wsPhTuhoNzticcgxVAEuZd.jpg	t
4	2026-02-13 07:03:25.305149+00	Rode NTG3	ไมค์บูม NTG3	\N	\N	Audio	Rode	NTG3	https://i0.wp.com/centralmusic.hk/wp-content/uploads/2021/09/NTG3_SM4_Boompole.jpg?fit=1000%2C667&ssl=1	t
\.


--
-- Data for Name: production_works; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."production_works" ("id", "created_at", "title_en", "title_th", "short_desc_en", "short_desc_th", "full_desc_en", "full_desc_th", "media_type", "media_url", "thumbnail_url", "category", "featured", "year", "client", "tags") FROM stdin;
3	2026-02-13 07:26:48.896809+00	Product Showcase	โชว์เคสสินค้า	Product photography for new collection.	ภาพถ่ายสินค้าสำหรับคอลเลกชันใหม่	\N	\N	image	#	https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80	Still Images	f	\N	\N	\N
4	2026-02-13 07:26:48.896809+00	Wedding Coverage	งานแต่งงาน	Cinematic wedding highlights.	ไฮไลท์งานแต่งงานในรูปแบบภาพยนตร์	\N	\N	video	#	https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80	Events	f	\N	\N	\N
5	2026-02-13 07:26:48.896809+00	How-To Guide	คู่มือวิธีการ	Step-by-step instructional video.	วิดีโอแนะนำขั้นตอนการใช้งาน	\N	\N	video	#	https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80	Tutorial Clips	f	\N	\N	\N
6	2026-02-13 07:26:48.896809+00	Portrait Session	ถ่ายภาพบุคคล	Professional headshots and portraits.	ภาพถ่ายบุคคลระดับมืออาชีพ	\N	\N	image	#	https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80	Still Images	f	\N	\N	\N
1	2026-02-13 07:26:48.896809+00	Corporate Event	งานองค์กร	Highlights from the annual corporate seminar.	ภาพบรรยากาศงานสัมมนาประจำปี	\N	\N	video	#	https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80	Events	t	\N	\N	\N
2	2026-02-13 07:26:48.896809+00	Tutorial Series	ซีรีส์สอน	Educational video series on software development.	วิดีโอสอนการพัฒนาซอฟต์แวร์	\N	\N	video	https://www.youtube.com/watch?v=TCD5cK94YvQ	https://www.youtube.com/watch?v=TCD5cK94YvQ	Tutorial Clips	t	\N	\N	\N
\.


--
-- Data for Name: software_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."software_projects" ("id", "created_at", "title_en", "short_desc_en", "full_desc_en", "target_en", "features_en", "title_th", "short_desc_th", "full_desc_th", "target_th", "features_th", "url", "image_url", "category", "status", "version", "featured_slot") FROM stdin;
3	2026-02-13 07:26:48.896809+00	Messaging Hub	Unified communication platform for team messaging.	Messaging Hub serves as your organization's central communication nerve center. This unified platform enables seamless team messaging, broadcast announcements, and targeted communication channels.	Medium to large enterprises\nEducational institutions	Broadcast messaging to groups\nScheduled message delivery	ศูนย์กลางสื่อสาร	แพลตฟอร์มสื่อสารรวมศูนย์ เพื่อการส่งข้อความทีม	Messaging Hub คือศูนย์กลางการสื่อสารขององค์กร แพลตฟอร์มรวมศูนย์นี้ช่วยให้การส่งข้อความทีมและประกาศข่าวสารเป็นเรื่องง่าย	- องค์กรขนาดกลางถึงใหญ่\\n- สถาบันการศึกษา	- ส่งข้อความบรอดแคสต์\\n- ตั้งเวลาส่งข้อความ	https://tagcast-connect.lovable.app	https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80	Web App	Active	\N	1
2	2026-02-13 07:26:48.896809+00	Freetime Matcher	Intelligent scheduling tool for matching availability.	Freetime Matcher revolutionizes the way teams coordinate their schedules. This intelligent scheduling tool analyzes team members' availability and automatically suggests optimal meeting times.	Remote and hybrid teams\nProject managers\\n- HR coordinators	Smart availability matching algorithm\nMulti-timezone support\nCalendar integration	ระบบจัดตารางเวลา	เครื่องมือจัดตารางเวลาอัจฉริยะ สำหรับจับคู่เวลาว่าง	Freetime Matcher ปฏิวัติการนัดหมายทีมด้วยการวิเคราะห์เวลาว่างและแนะนำเวลาประชุมที่เหมาะสมที่สุดโดยอัตโนมัติ บอกลาการส่งอีเมลไปมาเพื่อหาเวลาที่เหมาะสม	- ทีมทำงานระยะไกล\\n- ผู้จัดการโครงการ\\n- ผู้ประสานงาน HR	- อัลกอริทึมจับคู่เวลาอัจฉริยะ\\n- รองรับหลายเขตเวลา\\n- เชื่อมต่อปฏิทิน	https://ft-matcher.lovable.app/	https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80	Web App	Active	\N	3
1	2026-02-13 07:26:48.896809+00	Check-in System	A streamlined check-in system for tracking attendance and achievements.	Our Check-in System is a comprehensive solution designed for organizations to track attendance and monitor participant achievements in real-time. Built with modern web technologies, it offers a seamless experience for both administrators and users.	Corporate HR departments\nEducational institutions\nEvent organizers	Real-time attendance tracking\nQR code check-in capability\nAutomated achievement badges	ระบบเช็คชื่อ	ระบบเช็คชื่อที่ทันสมัย สำหรับติดตามการเข้าเรียนและความสำเร็จแบบเรียลไทม์	ระบบ Check-in System เป็นโซลูชันครบวงจรที่ออกแบบมาสำหรับองค์กรที่ต้องการติดตามการเข้าร่วมและตรวจสอบความสำเร็จของผู้เข้าร่วมแบบเรียลไทม์ สร้างด้วยเทคโนโลยีเว็บที่ทันสมัย	- ฝ่ายทรัพยากรบุคคล\\n- สถาบันการศึกษา\\n- ผู้จัดงานอีเวนต์	- ติดตามการเข้าร่วมแบบเรียลไทม์\\n- เช็คอินด้วย QR Code\\n- ตราความสำเร็จอัตโนมัติ	https://check-it-ouch.lovable.app/	https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80	Web App	Active	\N	2
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
landpages-media	landpages-media	\N	2026-02-12 17:15:52.064165+00	2026-02-12 17:15:52.064165+00	t	f	\N	\N	\N	STANDARD
images	images	\N	2026-02-16 05:43:35.309098+00	2026-02-16 05:43:35.309098+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
a51cc209-cbfa-4157-9eeb-50f51d3d0a06	images	DSBusinessPlan_1772785302701.pdf	2343ae50-c66f-4ef7-bd87-07aa49682c7e	2026-03-06 08:21:51.16913+00	2026-03-06 08:21:51.16913+00	2026-03-06 08:21:51.16913+00	{"eTag": "\\"28df793d5b6a7499c9ef7f45b452b3b7-2\\"", "size": 9169433, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-03-06T08:21:51.000Z", "contentLength": 9169433, "httpStatusCode": 200}	d3de1c2a-ca8c-414f-8131-5a2bbd530b31	2343ae50-c66f-4ef7-bd87-07aa49682c7e	{}
87a469fa-325d-4f07-9ccf-7020a5ef4f77	images	547674150_122112071312987911_2525542087216709983_n_1773088944197.jpg	2343ae50-c66f-4ef7-bd87-07aa49682c7e	2026-03-09 20:42:37.115895+00	2026-03-09 20:42:37.115895+00	2026-03-09 20:42:37.115895+00	{"eTag": "\\"93fc664e4c835a54cc2fcbaa5fa90aa7\\"", "size": 755421, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-03-09T20:42:38.000Z", "contentLength": 755421, "httpStatusCode": 200}	bb25a9f9-498b-428d-ad7b-24357c3a2bbf	2343ae50-c66f-4ef7-bd87-07aa49682c7e	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata", "metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 31, true);


--
-- Name: production_gear_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."production_gear_id_seq"', 5, true);


--
-- Name: production_works_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."production_works_id_seq"', 6, true);


--
-- Name: software_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."software_projects_id_seq"', 3, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict cyJOYvCofREzu94WFoXi0ZeueUdUCaprK7tTrLYjljtOf46i2GJoIjBuKR9Pshb

RESET ALL;
