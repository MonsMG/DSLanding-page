import { Sparkles, Target, Users, Heart } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";
import type { LucideIcon } from "lucide-react";

const valueIcons: Record<string, LucideIcon> = {
  innovation: Sparkles,
  quality: Target,
  collaboration: Users,
  passion: Heart,
};

const About = () => {
  const { language, t } = useLanguage();
  const { about } = contentData;

  const stats = [
    about.stats.projects,
    about.stats.clients,
    about.stats.experience,
    about.stats.team,
  ];

  const values = Object.entries(about.values.items).map(([key, value]) => ({
    key,
    icon: valueIcons[key],
    title: value.title,
    description: value.description,
  }));

  // 1. สร้าง Mockup ข้อมูล CEO (เอาไว้ด้านบนก่อน return หรือนอก Component ก็ได้)
  const ceos = [
    {
      id: 1,
      name: "Alexander Wright",
      role: "Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop", // รูปจำลอง
      bio: "With over 15 years of experience in digital production and technology, Alexander leads the company's global vision and strategic direction.",
      link: "#",
    },
    {
      id: 2,
      name: "Sophia Martinez",
      role: "Co-Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", // รูปจำลอง
      bio: "Sophia drives operational excellence and creative innovation, ensuring that every project exceeds client expectations and industry standards.",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      <main className="relative z-10 pb-20 ">
        <div className="max-w-100% mx-auto ">
          {/* Header — entrance */}
          <div className="relative w-full flex items-center bg-orange-900 overflow-hidden min-h-[400px] md:min-h-[500px] animate-fade-in-up">
            {/* 🖼️ เลเยอร์ที่ 1: รูปภาพพื้นหลัง (ชิดขวา) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://lcinkptronrfkojdtzxw.supabase.co/storage/v1/object/public/images/547674150_122112071312987911_2525542087216709983_n_1773088944197.jpg" // 👈 เปลี่ยนเป็นลิงก์รูปภาพของคุณ
                alt={t(about.title)}
                className="w-full h-full object-cover object-right"
              />

              {/* 🌫️ เลเยอร์ที่ 2: พระเอกของงาน (Gradient Overlay) 
        ไล่สีส้มทึบจากฝั่งซ้าย (40%) -> ค่อยๆ จางลง (60%) -> ใสแจ๋วทางฝั่งขวา */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-900 from-40% via-orange-900/50 via-60% to-transparent" />
            </div>

            {/* 📝 เลเยอร์ที่ 3: กล่องข้อความฝั่งซ้าย (อยู่บนสุด z-10) */}
            <div className="relative z-10 w-full px-8 py-16 md:px-16 lg:px-24 md:w-2/3 lg:w-1/2 text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-md">
                {t(about.title)}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow">
                {t(about.description)}
              </p>
            </div>
          </div>

          {/* About Us */}
          <div className="flex  text-left animate-fade-in-up bg-white pl-20 pr-20 pt-20 pb-20">
            <h1 className="items-center text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6">
              {t(about.mission.title)}
            </h1>
            <div className="flex justify-center items-center ml-96">
              <p className="text-lg sm:text-xl text-black max-w-3xl leading-relaxed">
                {t(about.mission.description)}
              </p>
            </div>
          </div>

          {/* Infomation Detail */}
          <div className="text-left animate-fade-in-up bg-red-900 pl-20 pr-20 pt-12 pb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t(about.title)}
            </h1>
            <p className="text-lg sm:text-xl text-white max-w-3xl leading-relaxed">
              {t(about.description)}
            </p>
          </div>

          {/* Company Vision */}
          <section className="relative z-10 py-20 px-6">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(about.values.subtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(about.values.title)}
                </h2>
              </div>

              {/* Vision Cards — 3 cards styled like Production service cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 min-h-[450px]">
                {values.slice(0, 3).map((value, idx) => {
                  const IconComponent = value.icon;
                  return (
                    <div
                      key={value.key}
                      className={`flex flex-col bg-card border border-border rounded-3xl p-8 lg:p-10 group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up stagger-${idx + 1}`}
                    >
                      {/* 🔝 ส่วนบน: Icon และ หัวข้อ */}
                      <div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(var(--ds-cream))] flex items-center justify-center mb-6 group-hover:from-primary/20 transition-colors">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 text-left">
                          {t(value.title)}
                        </h3>
                      </div>

                      {/* 🔽 ส่วนล่าง: คำอธิบาย */}
                      <div className="mt-auto pt-10">
                        <p className="text-foreground/70 text-left leading-relaxed">
                          {t(value.description)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ส่วนแสดงผล CEO Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12 px-4">
            {ceos.map((ceo) => (
              <div
                key={ceo.id}
                className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* 🖼️ ส่วนรูปภาพ */}
                <div className="relative h-72 md:h-80 overflow-hidden bg-muted">
                  <img
                    src={ceo.image}
                    alt={ceo.name}
                    // ลูกเล่น: พอเอาเมาส์ชี้การ์ด รูปจะค่อยๆ ซูมเข้า (scale-105)
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* 📝 ส่วนเนื้อหา */}
                <div className="p-8 flex flex-col flex-grow">
                  {/* ชื่อและตำแหน่ง */}
                  <div className="mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-[hsl(var(--ds-chocolate))] mb-1">
                      {ceo.name}
                    </h3>
                    <span className="text-primary font-bold tracking-widest text-xs uppercase">
                      {ceo.role}
                    </span>
                  </div>

                  {/* คำอธิบาย */}
                  {/* flex-grow จะช่วยดันปุ่ม Read More ลงไปอยู่ล่างสุดของการ์ดเสมอ */}
                  <div className="text-foreground/70 leading-relaxed mb-8 flex-grow">
                    <p>{ceo.bio}</p>
                  </div>

                  {/* 🖱️ ปุ่ม Read More */}
                  {/* ใช้แท็ก <a> เพียวๆ ตกแต่งให้เหมือนปุ่มแทนการครอบด้วย <button> */}
                  <div className="mt-auto pt-4 border-t border-border/50">
                    <a
                      href={ceo.link}
                      className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-[hsl(var(--ds-chocolate))] text-[hsl(var(--ds-chocolate))] font-bold rounded-xl hover:bg-[hsl(var(--ds-chocolate))] hover:text-white transition-colors duration-300"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See more from PDF Information (CTA Section) */}
          <div className="py-16 px-6 bg-gradient-to-br from-[hsl(var(--ds-cream))] to-white text-center rounded-3xl shadow-sm border border-border/50 max-w-4xl mx-auto my-12">
            {/* ส่วน Head 1 (เลือก Draft ที่ชอบมาใส่ได้เลยครับ) */}
            <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
              {language === "en"
                ? "Discover Our Comprehensive Business Profile"
                : "ค้นพบโปรไฟล์ธุรกิจฉบับสมบูรณ์ของเรา"}
            </h1>

            <p className="text-foreground/70 max-w-2xl mx-auto mb-8 text-lg">
              {language === "en"
                ? "Download our full business plan to learn more about our services, methodologies, and how we can help your business grow."
                : "ดาวน์โหลดแผนธุรกิจฉบับเต็มเพื่อเรียนรู้เพิ่มเติมเกี่ยวกับบริการ วิธีการทำงาน และสิ่งที่เราสามารถช่วยให้ธุรกิจของคุณเติบโต"}
            </p>

            {/* ปุ่มลิงก์ไป PDF (เอาแท็ก <button> ออก ใช้แค่ <a> เพียวๆ) */}
            <div>
              <a
                href="https://lcinkptronrfkojdtzxw.supabase.co/storage/v1/object/public/images/DSBusinessPlan_1772785302701.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[hsl(var(--ds-chocolate))] text-white font-bold rounded-xl hover:bg-[hsl(var(--ds-chocolate))]/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                {/* สามารถใส่ Icon เช่น Document หรือ Download ตรงนี้เพิ่มได้ครับ */}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {language === "en"
                  ? "See More Detail (PDF)"
                  : "ดูรายละเอียดเพิ่มเติม (PDF)"}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
