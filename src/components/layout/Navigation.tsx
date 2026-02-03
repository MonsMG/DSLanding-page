import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/it", label: "Software" },
    { path: "/production", label: "Production" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/95 backdrop-blur-sm shadow-soft">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* DS workspace Logo - Left */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#333333] tracking-tight">DS workspace</span>
        </Link>

        {/* Nav Links - Right */}
        <div className="flex items-center gap-1 bg-white/80 px-2 py-2 rounded-xl border border-border">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-5 py-2 rounded-xl text-sm font-medium ${
                isActive(link.path) ? "text-white bg-[#F16001]" : "text-[#333333] hover:text-[#F16001]"
              }`}
            >
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
