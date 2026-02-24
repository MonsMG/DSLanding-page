/**
 * 📦 Footer — คอมโพเนนต์ Footer สำหรับทุกหน้า
 *
 * แสดง:
 *   - โลโก้ DS + ชื่อบริษัท
 *   - ลิงก์ navigation
 *   - ข้อมูลติดต่อ
 *   - Copyright
 */

import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { path: "/", label: t(contentData.nav.home) },
    { path: "/it", label: t(contentData.nav.software) },
    { path: "/production", label: t(contentData.nav.production) },
    { path: "/about", label: t(contentData.nav.about) },
    { path: "/contact", label: t(contentData.nav.contact) },
  ];

  return (
    <footer className="relative z-10 bg-[hsl(var(--ds-chocolate))] text-white/90">
      {/* Gradient accent line at top */}
      <div className="h-1 bg-gradient-to-r from-primary via-[hsl(var(--ds-red-orange))] to-primary" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & Brand */}
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4 group">
              <span className="text-3xl font-bold text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                DS
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary group-hover:scale-125 transition-transform duration-300" />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              {language === "en"
                ? "Production House — Creative Software & Media Production"
                : "Production House — ซอฟต์แวร์สร้างสรรค์ & สื่อโปรดักชัน"}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              {language === "en" ? "Navigation" : "เมนู"}
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-primary text-sm transition-colors duration-200 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              {language === "en" ? "Contact" : "ติดต่อ"}
            </h4>
            <div className="space-y-2 text-sm text-white/60">
              <p className="hover:text-white/80 transition-colors">
                ds.productionhouse@gmail.com
              </p>
              <p className="hover:text-white/80 transition-colors">
                {language === "en"
                  ? "Bangkok, Thailand"
                  : "กรุงเทพฯ, ประเทศไทย"}
              </p>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/40 text-xs">
            © {currentYear} DS Production House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
