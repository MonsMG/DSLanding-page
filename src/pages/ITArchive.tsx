import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ExternalLink, Globe } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, CalendarCheck, Mail, Database, Layout, Server, Cloud, Shield, Cpu } from "lucide-react";

interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

const allProjects: Project[] = [
  {
    id: "1",
    name: "Check-in System",
    link: "https://check-it-ouch.lovable.app/",
    description: "A streamlined check-in system for tracking attendance and achievements with real-time updates.",
    category: "Web App",
    icon: BadgeCheck
  },
  {
    id: "2",
    name: "Freetime Matcher",
    link: "https://ft-matcher.lovable.app/",
    description: "Intelligent scheduling tool for matching availability and coordinating team meetings efficiently.",
    category: "Web App",
    icon: CalendarCheck
  },
  {
    id: "3",
    name: "Messaging Hub",
    link: "https://uni-send-broadcast.lovable.app/",
    description: "Unified communication platform for seamless team messaging and broadcast announcements.",
    category: "Web App",
    icon: Mail
  },
  {
    id: "4",
    name: "Data Analytics Dashboard",
    link: "https://example.com/analytics",
    description: "Comprehensive data visualization and analytics platform for business intelligence.",
    category: "Database",
    icon: Database
  },
  {
    id: "5",
    name: "Corporate Portal",
    link: "https://example.com/portal",
    description: "Internal corporate portal for employee management and resource access.",
    category: "Website",
    icon: Layout
  },
  {
    id: "6",
    name: "API Gateway",
    link: "https://example.com/api",
    description: "Centralized API management and gateway for microservices architecture.",
    category: "Backend",
    icon: Server
  },
  {
    id: "7",
    name: "Cloud Storage Solution",
    link: "https://example.com/cloud",
    description: "Secure cloud storage and file sharing platform for enterprises.",
    category: "Cloud",
    icon: Cloud
  },
  {
    id: "8",
    name: "Security Audit Tool",
    link: "https://example.com/security",
    description: "Automated security vulnerability scanning and reporting tool.",
    category: "Security",
    icon: Shield
  },
  {
    id: "9",
    name: "ML Model Dashboard",
    link: "https://example.com/ml",
    description: "Machine learning model monitoring and deployment dashboard.",
    category: "AI/ML",
    icon: Cpu
  }
];

const categories = ["All", "Web App", "Website", "Database", "Backend", "Cloud", "Security", "AI/ML"];

const ITArchive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#F16001]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-50 to-transparent rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333] mb-4">
              IT Project Archive
            </h1>
            <p className="text-lg text-[#333333]/70 max-w-2xl mx-auto">
              Browse our complete collection of IT solutions and digital products
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-10"
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#333333]/50" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg border-gray-200 rounded-xl focus:border-[#F16001] focus:ring-[#F16001]"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Filter className="w-4 h-4 text-[#333333]/50 mr-2" />
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-[#F16001] text-white hover:bg-[#d95601]"
                      : "text-[#333333] hover:bg-[#F16001]/10 hover:border-[#F16001]"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => {
              const IconComponent = project.icon;
              return (
                <motion.a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon Area */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#F16001]/5 to-orange-50 flex items-center justify-center relative">
                    <IconComponent
                      className="w-16 h-16 text-[#F16001]/70 group-hover:text-[#F16001] group-hover:scale-110 transition-all duration-300"
                      strokeWidth={1.5}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs bg-white/80">
                        {project.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-semibold text-[#333333] group-hover:text-[#F16001] transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-[#333333]/40 group-hover:text-[#F16001] transition-colors flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-[#333333]/60 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Globe className="w-16 h-16 text-[#333333]/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#333333] mb-2">No projects found</h3>
              <p className="text-[#333333]/60">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default ITArchive;