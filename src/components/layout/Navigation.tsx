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
      {/* Fixed Header — locked scale with fixed heights instead of paddings */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b border-[hsl(var(--ds-chocolate))]/50 ${
          scrolled
            ? "h-16 bg-card/95 backdrop-blur-xl shadow-lg"
            : "h-20 bg-card/70 backdrop-blur-md shadow-sm"
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between"
          style={{ transform: "translateZ(0)" }}
        >
          {/* DS Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight group-hover:text-primary transition-colors duration-300">
              DS
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary group-hover:scale-125 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 h-[42px] flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${
                  isActive(link.path)
                    ? "text-primary-foreground bg-[hsl(var(--ds-chocolate))] shadow-md border-[hsl(var(--ds-chocolate))]/10"
                    : "text-foreground hover:text-primary hover:bg-[hsl(var(--ds-chocolate))]/5 hover:border-[hsl(var(--ds-chocolate))]/20 hover:shadow-sm"
                }`}
                style={{ minWidth: "110px" }}
              >
                <span className="relative z-10 font-bold flex items-center gap-2">
                  <link.icon className="w-[18px] h-[18px]" />
                  {link.label}
                </span>
                {/* Active underline indicator */}
                {isActive(link.path) && (
                  <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] h-[3px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </Link>
            ))}
          </div>

          {/* Language Switcher + Admin Logout + Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-semibold border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              {language.toUpperCase()}
            </Button>

            {/* 🔐 Admin Area Buttons */}
            {user && (
              <>
                <Link to="/admin/media" className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-sm shadow-sm border-primary/20 hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
                  >
                    <FolderClosed className="w-4 h-4 mr-1.5" />
                    {language === "th" ? "จัดการไฟล์" : "Files"}
                  </Button>
                </Link>
                <Link to="/admin/company-info" className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-sm shadow-sm border-primary/20 hover:bg-primary/10 hover:text-primary transition-all rounded-xl"
                  >
                    <Settings className="w-4 h-4 mr-1.5" />
                    {language === "th" ? "ตั้งค่าบริษัท" : "Company Info"}
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={signOut}
                  className="hidden sm:flex px-3 py-1 text-sm shadow-sm rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  {language === "th" ? "ออกระบบ" : "Logout"}
                </Button>
              </>
            )}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu — animated slide-down */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border shadow-lg animate-slide-down">
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all shadow-sm animate-fade-in-up stagger-${idx + 1} ${
                    isActive(link.path)
                      ? "text-primary-foreground bg-[hsl(var(--ds-chocolate))] border-l-4 border-primary"
                      : "text-foreground hover:bg-muted border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              ))}

              {/* 🔐 Admin Mobile Buttons */}
              {user && (
                <div className="mt-2 space-y-2 border-t border-border pt-2 animate-fade-in-up stagger-6">
                  <Link
                    to="/admin/media"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center gap-2 w-full px-4 py-3 rounded-xl text-base font-medium transition-all text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    <FolderClosed className="w-5 h-5" />
                    {language === "th" ? "จัดการไฟล์" : "Files"}
                  </Link>

                  <Link
                    to="/admin/company-info"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center gap-2 w-full px-4 py-3 rounded-xl text-base font-medium transition-all text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    <Settings className="w-5 h-5" />
                    {language === "th" ? "ตั้งค่าบริษัท" : "Company Info"}
                  </Link>

                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-medium transition-all text-destructive-foreground bg-destructive hover:bg-destructive/90"
                  >
                    <LogOut className="w-5 h-5" />
                    {language === "th" ? "ออกจากระบบ" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="h-20 w-full bg-transparent" aria-hidden="true" />
    </>
  );
};

export default Navigation;
