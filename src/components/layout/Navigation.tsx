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
    <header>
      <nav>
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
