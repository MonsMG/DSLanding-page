import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/it", label: "IT" },
    { path: "/production", label: "Production" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100, scale: 0.9 }}
      animate={{ y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/95 backdrop-blur-sm shadow-soft"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* DS workspace Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-xl font-bold text-[#333333] tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            DS workspace
          </motion.span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1 bg-white/80 px-2 py-2 rounded-xl border border-border">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? "text-white"
                  : "text-[#333333] hover:text-[#F16001]"
              }`}
            >
              {isActive(link.path) && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 bg-[#F16001] rounded-xl"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Spacer for layout balance */}
        <div className="w-24 hidden sm:block" />
      </nav>
    </motion.header>
  );
};

export default Navigation;