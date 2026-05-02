import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Home,
  Monitor,
  Film,
  Info,
  Settings,
  FolderClosed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { contentData } from "@/data/content";

const Navigation = () => {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-aware navbar effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    // เช็คสถานะ scroll ทันทีเมื่อเปลี่ยนหน้า (pathname changed) เพื่อลดอาการกระตุก
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: t(contentData.nav.home), icon: Home },
    { path: "/software", label: t(contentData.nav.software), icon: Monitor },
    { path: "/production", label: t(contentData.nav.production), icon: Film },
    { path: "/about", label: t(contentData.nav.about), icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 🎨 Fixed Header — ปรับ Glassmorphism และ Transition ให้สมูทที่สุด */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b ${
          scrolled
            ? "h-16 bg-white/80 backdrop-blur-xl border-border/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)]"
            : "h-20 bg-white/40 backdrop-blur-md border-transparent shadow-none"
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between"
          style={{ transform: "translateZ(0)" }}
        >
          {/* โลโก้ DS */}
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="text-2xl font-black text-[hsl(var(--ds-chocolate))] tracking-tight group-hover:text-primary transition-colors duration-300">
              DS
            </span>
            <span className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav Links (ทรง Pill โค้งมน) */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-muted/20 backdrop-blur-sm rounded-full border border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 outline-none ${
                  isActive(link.path)
                    ? "text-white bg-[hsl(var(--ds-chocolate))] shadow-md"
                    : "text-[hsl(var(--ds-chocolate))]/70 hover:text-[hsl(var(--ds-chocolate))] hover:bg-white/60 hover:shadow-sm"
                }`}
                style={{ minWidth: "100px" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <link.icon
                    className={`w-[16px] h-[16px] ${isActive(link.path) ? "text-primary-foreground" : "text-primary"}`}
                  />
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Language Switcher + Admin Logout + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ปุ่มเปลี่ยนภาษา */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="w-10 h-10 rounded-full font-bold text-[hsl(var(--ds-chocolate))] bg-white/50 border border-border/50 shadow-sm hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              {language.toUpperCase()}
            </Button>

            {/* 🔐 Admin Area Buttons (ปรับเป็นปุ่มโค้งมนมนแบบพรีเมียม) */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 border-l border-border/60 pl-3 ml-1">
                <Link to="/admin/media">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-xs font-semibold text-[hsl(var(--ds-chocolate))]/80 bg-white/50 border border-border/50 shadow-sm hover:bg-primary/5 hover:text-primary transition-all rounded-full"
                  >
                    <FolderClosed className="w-4 h-4 mr-1.5 text-primary" />
                    {language === "th" ? "จัดการไฟล์" : "Files"}
                  </Button>
                </Link>
                <Link to="/admin/company-info">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-xs font-semibold text-[hsl(var(--ds-chocolate))]/80 bg-white/50 border border-border/50 shadow-sm hover:bg-primary/5 hover:text-primary transition-all rounded-full"
                  >
                    <Settings className="w-4 h-4 mr-1.5 text-primary" />
                    {language === "th" ? "ตั้งค่า" : "Config"}
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={signOut}
                  className="h-9 px-4 text-xs shadow-sm rounded-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  {language === "th" ? "ออกระบบ" : "Logout"}
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-border/50 shadow-sm hover:bg-primary/10 hover:text-primary transition-colors text-[hsl(var(--ds-chocolate))]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* 📱 Mobile Menu — ปรับดีไซน์ให้นุ่มนวลขึ้น เป็นการ์ดลอยๆ */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-4 mt-2 mb-4 p-4 bg-white/95 backdrop-blur-xl border border-border/50 shadow-[0_10px_40px_rgb(0,0,0,0.08)] rounded-3xl flex flex-col gap-1.5">
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                  isActive(link.path)
                    ? "text-[hsl(var(--ds-chocolate))] bg-primary/10" // สไตล์ใหม่ นุ่มนวลขึ้น
                    : "text-foreground/70 hover:bg-muted hover:text-[hsl(var(--ds-chocolate))]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive(link.path)
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                    }`}
                  >
                    <link.icon
                      className={`w-5 h-5 ${
                        isActive(link.path)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  {link.label}
                </div>
              </Link>
            ))}

            {/* 🔐 Admin Mobile Buttons */}
            {user && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-4 px-2">
                <Link
                  to="/admin/media"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-[hsl(var(--ds-chocolate))] bg-muted/50 hover:bg-primary/10"
                >
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <FolderClosed className="w-4 h-4 text-primary" />
                  </div>
                  {language === "th" ? "จัดการไฟล์ระบบ" : "Media Files"}
                </Link>

                <Link
                  to="/admin/company-info"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-[hsl(var(--ds-chocolate))] bg-muted/50 hover:bg-primary/10"
                >
                  <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <Settings className="w-4 h-4 text-primary" />
                  </div>
                  {language === "th" ? "ตั้งค่าบริษัท" : "Company Settings"}
                </Link>

                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-3 rounded-xl text-sm font-bold transition-all text-destructive bg-destructive/10 hover:bg-destructive hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  {language === "th" ? "ออกจากระบบ" : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer ป้องกันเนื้อหาถูก Header บัง */}
      <div className="h-20 w-full bg-transparent" aria-hidden="true" />
    </>
  );
};

export default Navigation;
