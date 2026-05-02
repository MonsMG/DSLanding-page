import { Sparkles, Target, Users, Heart, FileText } from "lucide-react";
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

  // 1. URL ของไฟล์ PDF จาก Supabase
  const pdfUrl =
    "https://lcinkptronrfkojdtzxw.supabase.co/storage/v1/object/public/images/DSBusinessPlan_1772785302701.pdf";

  // 2. 🌟 พระเอกของเรา: โยนลิงก์ PDF เข้า Web Viewer เพื่อหลบ Extension ของ Adobe
  // วิธีนี้จะได้หน้าตาเหมือน Chrome Native Viewer (มีแถบดำ มี Thumbnails ด้านข้าง)
  const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}#pagemode=thumbs`;

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

  const ceos = [
    {
      id: 1,
      name: "Alexander Wright",
      role: { en: "Chief Executive Officer", th: "ประธานเจ้าหน้าที่บริหาร" },
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
      bio: {
        en: "With over 15 years of experience in digital production and technology, Alexander leads the company's global vision and strategic direction.",
        th: "ด้วยประสบการณ์กว่า 15 ปีในด้านดิจิทัลโปรดักชั่นและเทคโนโลยี อเล็กซานเดอร์เป็นผู้นำวิสัยทัศน์และทิศทางเชิงกลยุทธ์ระดับโลกของบริษัท",
      },
      link: "#",
    },
    {
      id: 2,
      name: "Sophia Martinez",
      role: {
        en: "Co-Chief Executive Officer",
        th: "ประธานเจ้าหน้าที่บริหารร่วม",
      },
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      bio: {
        en: "Sophia drives operational excellence and creative innovation, ensuring that every project exceeds client expectations and industry standards.",
        th: "โซเฟียขับเคลื่อนความเป็นเลิศด้านการปฏิบัติงานและนวัตกรรมเชิงสร้างสรรค์ เพื่อให้มั่นใจว่าทุกโปรเจกต์ก้าวข้ามความคาดหวังของลูกค้าและมาตรฐานอุตสาหกรรม",
      },
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      <main className="relative z-10 pb-20">
        <div className="w-full">
          {/* Header — entrance */}
          <div className="relative w-full flex items-center overflow-hidden min-h-[500px] md:min-h-[600px] animate-fade-in-up">
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://lcinkptronrfkojdtzxw.supabase.co/storage/v1/object/public/images/547674150_122112071312987911_2525542087216709983_n_1773088944197.jpg"
                alt={t(about.title)}
                className="w-full h-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--ds-chocolate))]/95 via-[hsl(var(--ds-chocolate))]/80 to-transparent" />
            </div>

            <div className="relative z-10 w-full px-6 py-16 md:px-12 lg:px-24 md:w-2/3 lg:w-1/2 text-left">
              <span className="text-sm font-bold text-primary/80 mb-4 block uppercase tracking-widest drop-shadow-sm">
                Discover Our Story
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-md">
                {t(about.title)}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow">
                {t(about.description)}
              </p>
            </div>
          </div>

          {/* About Us & Mission */}
          <section className="relative z-10 py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 leading-tight">
                    {t(about.mission.title)}
                  </h1>
                </div>
                <div>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    {t(about.mission.description)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Infomation Detail */}
          <section className="relative z-10 py-24 bg-[hsl(var(--ds-chocolate))] text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="container mx-auto px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  {t(about.title)}
                </h2>
                <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
                  {t(about.description)}
                </p>
              </div>
            </div>
          </section>

          {/* Company Vision */}
          <section className="relative z-10 py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                  {t(about.values.subtitle)}
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                  {t(about.values.title)}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 min-h-[450px]">
                {values.slice(0, 3).map((value, idx) => {
                  const IconComponent = value.icon;
                  return (
                    <div
                      key={value.key}
                      className={`flex flex-col bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] p-8 lg:p-10 group hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 animate-fade-in-up stagger-${idx + 1}`}
                    >
                      <div>
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-[hsl(var(--ds-chocolate))] mb-3 text-left">
                          {t(value.title)}
                        </h3>
                      </div>
                      <div className="mt-auto pt-8">
                        <p className="text-muted-foreground text-left leading-relaxed">
                          {t(value.description)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CEO Cards */}
          <section className="py-12 md:py-20 bg-background">
            <div className="text-center mb-16 px-6">
              <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
                Our Leadership
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[hsl(var(--ds-chocolate))]">
                Meet The Executive Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
              {ceos.map((ceo) => (
                <div
                  key={ceo.id}
                  className="bg-white border-0 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 flex flex-col group"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted rounded-t-[2rem]">
                    <img
                      src={ceo.image}
                      alt={ceo.name}
                      className="block w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out transform-gpu"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                  </div>

                  <div className="px-8 pb-8 pt-2 md:px-10 md:pb-10 md:pt-4 flex flex-col flex-grow relative z-20 bg-white">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-[hsl(var(--ds-chocolate))] mb-2">
                        {ceo.name}
                      </h3>
                      <span className="text-primary font-bold tracking-widest text-xs uppercase">
                        {t(ceo.role)}
                      </span>
                    </div>

                    <div className="text-muted-foreground leading-relaxed flex-grow font-light">
                      <p>{t(ceo.bio)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section (See more from PDF) */}
          <section className="py-16 md:py-20 px-6 max-w-5xl mx-auto my-12 md:my-20">
            <div className="relative bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border-0 overflow-hidden text-center group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[hsl(var(--ds-cream))] to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(var(--ds-chocolate))] mb-6 leading-tight">
                  {t({
                    en: "Discover Our Comprehensive Business Profile",
                    th: "ค้นพบโปรไฟล์ธุรกิจฉบับสมบูรณ์ของเรา",
                  })}
                </h2>

                <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg md:text-xl leading-relaxed">
                  {t({
                    en: "Download our full business plan to learn more about our services, methodologies, and how we can help your business grow.",
                    th: "ดาวน์โหลดแผนธุรกิจฉบับเต็มเพื่อเรียนรู้เพิ่มเติมเกี่ยวกับบริการ วิธีการทำงาน และสิ่งที่เราสามารถช่วยให้ธุรกิจของคุณเติบโต",
                  })}
                </p>

                {/* ✅ เปลี่ยนมาใช้ tag <a> และยิงไปที่ viewerUrl แทน */}
                <a
                  href={viewerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[hsl(var(--ds-chocolate))] text-white font-bold rounded-2xl hover:bg-primary hover:shadow-[0_8px_30px_rgb(222,49,99,0.3)] hover:-translate-y-1 transition-all duration-300 text-lg cursor-pointer"
                >
                  <FileText className="w-6 h-6 mr-3" />
                  {t({
                    en: "See More Detail (PDF)",
                    th: "ดูรายละเอียดเพิ่มเติม (PDF)",
                  })}
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
