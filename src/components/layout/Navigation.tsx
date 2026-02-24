import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { contentData } from "@/data/content";

const Navigation = () => {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: t(contentData.nav.home) },
    { path: "/it", label: t(contentData.nav.software) },
    { path: "/production", label: t(contentData.nav.production) },
    { path: "/about", label: t(contentData.nav.about) },
    { path: "/contact", label: t(contentData.nav.contact) },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 1. ส่วน Header ลอยตัว (Fixed) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-4 bg-card/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* DS Logo - Left */}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight">
              DS
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          </Link>

          {/* Desktop Nav Links - Center/Right */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? "text-primary-foreground bg-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Language Switcher + Mobile Menu - Rightmost */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-semibold border-border hover:bg-muted"
            >
              {language.toUpperCase()}
            </Button>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
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

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg">
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium ${
                    isActive(link.path)
                      ? "text-primary-foreground bg-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="h-16 w-full bg-transparent" aria-hidden="true" />
    </>
  );
};

export default Navigation;
