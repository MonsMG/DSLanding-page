import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: t(contentData.nav.home) },
    { path: "/software", label: t(contentData.nav.software) },
    { path: "/production", label: t(contentData.nav.production) },
    { path: "/about", label: t(contentData.nav.about) },
    { path: "/contact", label: t(contentData.nav.contact) },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Fixed Header — glassmorphism intensifies on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full px-6 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-card/90 backdrop-blur-xl shadow-soft border-b border-border"
            : "py-4 bg-card/60 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* DS Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight group-hover:text-primary transition-colors duration-300">
              DS
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary group-hover:scale-125 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-primary-foreground bg-primary shadow-md"
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Active underline indicator */}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-foreground/60 rounded-full" />
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

            {/* 🔐 Admin Global Logout Button */}
            {user && (
              <Button
                variant="destructive"
                size="sm"
                onClick={signOut}
                className="hidden sm:flex px-3 py-1 text-sm shadow-sm"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                {language === "th" ? "ออกระบบ" : "Logout"}
              </Button>
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
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all animate-fade-in-up stagger-${idx + 1} ${
                    isActive(link.path)
                      ? "text-primary-foreground bg-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* 🔐 Admin Global Logout Button (Mobile) */}
              {user && (
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-medium transition-all animate-fade-in-up stagger-6 text-destructive-foreground bg-destructive hover:bg-destructive/90"
                >
                  <LogOut className="w-5 h-5" />
                  {language === "th" ? "ออกจากระบบ" : "Logout"}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="h-16 w-full bg-transparent" aria-hidden="true" />
    </>
  );
};

export default Navigation;
