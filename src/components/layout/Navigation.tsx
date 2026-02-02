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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* DS Logo with Status Dot */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            className="text-2xl font-bold text-foreground tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            DS
          </motion.span>
          {/* Status Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="glass-card px-2 py-2 flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? "text-primary-foreground"
                  : "text-[#333333] hover:text-foreground"
              }`}
            >
              {isActive(link.path) && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
