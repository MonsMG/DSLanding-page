import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import ProjectCard from "@/components/it/ProjectCard";
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
    icon: BadgeCheck,
  },
  {
    id: "2",
    name: "Freetime Matcher",
    link: "https://ft-matcher.lovable.app/",
    description: "Intelligent scheduling tool for matching availability and coordinating team meetings efficiently.",
    category: "Web App",
    icon: CalendarCheck,
  },
  {
    id: "3",
    name: "Messaging Hub",
    link: "https://tagcast-connect.lovable.app",
    description: "Unified communication platform for seamless team messaging and broadcast announcements.",
    category: "Web App",
    icon: Mail,
  },
  {
    id: "4",
    name: "Data Analytics Dashboard",
    link: "https://example.com/analytics",
    description: "Comprehensive data visualization and analytics platform for business intelligence.",
    category: "Database",
    icon: Database,
  },
  {
    id: "5",
    name: "Corporate Portal",
    link: "https://example.com/portal",
    description: "Internal corporate portal for employee management and resource access.",
    category: "Website",
    icon: Layout,
  },
  {
    id: "6",
    name: "API Gateway",
    link: "https://example.com/api",
    description: "Centralized API management and gateway for microservices architecture.",
    category: "Backend",
    icon: Server,
  },
  {
    id: "7",
    name: "Cloud Storage Solution",
    link: "https://example.com/cloud",
    description: "Secure cloud storage and file sharing platform for enterprises.",
    category: "Cloud",
    icon: Cloud,
  },
  {
    id: "8",
    name: "Security Audit Tool",
    link: "https://example.com/security",
    description: "Automated security vulnerability scanning and reporting tool.",
    category: "Security",
    icon: Shield,
  },
  {
    id: "9",
    name: "ML Model Dashboard",
    link: "https://example.com/ml",
    description: "Machine learning model monitoring and deployment dashboard.",
    category: "AI/ML",
    icon: Cpu,
  },
];

const categories = ["All", ...Array.from(new Set(allProjects.map((p) => p.category)))];

const ITArchive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-beige))] to-[hsl(var(--ds-cream))]" />
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-[hsl(var(--ds-red-orange))]/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-4">
              Software Project Archive
            </h1>
          </div>

          {/* Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl border-border bg-card/80 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-1.5 text-sm rounded-full transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-card/80 hover:bg-muted border-border"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                link={project.link}
                description={project.description}
                icon={project.icon}
                category={project.category}
                showCategory
                compact
              />
            ))}
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default ITArchive;
