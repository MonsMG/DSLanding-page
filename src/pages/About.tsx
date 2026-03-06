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
  const { t } = useLanguage();
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
          <div className="text-left animate-fade-in-up bg-orange-900 p-20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t(about.title)}
            </h1>
            <p className="text-lg sm:text-xl text-white max-w-3xl leading-relaxed">
              {t(about.description)}
            </p>
            <img src="#" alt="#" />
          </div>

          {/* About Us */}
          <div className="text-left animate-fade-in-up bg-black pl-20 pr-20 pt-12 pb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t(about.title)}
            </h1>
            <p className="text-lg sm:text-xl text-white max-w-3xl leading-relaxed">
              {t(about.description)}
            </p>
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
          <div className="text-center animate-fade-in-up bg-red-900 pl-20 pr-20 pt-12 pb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t(about.title)}
            </h1>
            {/* Card details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-white p-40 rounded-xl"
                >
                  <h3 className="text-4xl font-bold text-black mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-lg text-black">{t(stat.label)}</p>
                </div>
              ))}
            </div>
          </div>

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

          {/* See more from PDF Information */}
          <div>
            <h1>.....</h1>
            <div>
              <button>
                <a
                  href="https://lcinkptronrfkojdtzxw.supabase.co/storage/v1/object/public/images/DSBusinessPlan_1772785302701.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  See More Detail
                </a>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
