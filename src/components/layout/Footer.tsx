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
import { Mail, Facebook, Clock, MapPin } from "lucide-react";

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { path: "/", label: t(contentData.nav.home) },
    { path: "/software", label: t(contentData.nav.software) },
    { path: "/production", label: t(contentData.nav.production) },
    { path: "/about", label: t(contentData.nav.about) },
  ];

  return (
    <footer className="relative z-10 bg-[hsl(var(--ds-chocolate))] text-white/90 border-t border-border">
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
            <p className="text-white/70 text-sm leading-relaxed">
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
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200 inline-block hover:translate-x-1 transform"
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
            <div className="space-y-3 text-sm text-white/70">
              <a
                href="mailto:ds_studio@gmail.com"
                className="hover:text-white transition-colors flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </span>
                ds_studio@gmail.com
              </a>
              <a
                href="https://www.facebook.com/share/1Aryrru3t1/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Facebook className="w-4 h-4 text-white" />
                </span>
                Digital Solution Studio
              </a>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </span>
                <span>
                  {language === "en" ? "Mon-Fri" : "จันทร์-ศุกร์"} 08:30 – 16:30
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </span>
                <span>
                  {language === "en"
                    ? "Bangkok , Thailand"
                    : "กรุงเทพฯ , ประเทศไทย"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/50 text-xs">
            © {currentYear} DS Production House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
