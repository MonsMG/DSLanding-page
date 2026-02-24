import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* Background matching design system */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ds-beige))] via-[hsl(var(--ds-cream))] to-white" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl float" />
      <div className="absolute bottom-1/4 -right-20 w-[300px] h-[300px] bg-[hsl(var(--ds-cream))] rounded-full blur-3xl float-delayed" />

      <div className="relative z-10 text-center px-6 animate-fade-in-up">
        {/* DS Logo */}
        <div className="flex items-center justify-center gap-1 mb-8">
          <span className="text-3xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight">
            DS
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
        </div>

        {/* 404 text with gradient */}
        <h1 className="text-8xl sm:text-9xl font-bold text-gradient mb-4 animate-fade-in-up stagger-1">
          404
        </h1>

        {/* Message */}
        <p className="text-2xl font-semibold text-[hsl(var(--ds-chocolate))] mb-2 animate-fade-in-up stagger-2">
          Page Not Found
        </p>
        <p className="text-foreground/60 mb-8 max-w-md mx-auto animate-fade-in-up stagger-3">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Decorative separator */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up stagger-3">
          <span className="w-12 h-[2px] bg-primary/30 rounded-full" />
          <span className="w-2 h-2 bg-primary/40 rounded-full" />
          <span className="w-12 h-[2px] bg-primary/30 rounded-full" />
        </div>

        {/* CTA */}
        <div className="animate-fade-in-up stagger-4">
          <Link to="/">
            <Button
              size="lg"
              className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
