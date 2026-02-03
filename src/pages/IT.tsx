import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BadgeCheck, CalendarCheck, Mail, ArrowRight } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

// Filtered projects - excluding "Code Playground" and "Mobile Dashboard"
const projects: Project[] = [
  {
    id: "1",
    name: "Check-in System",
    description: "A streamlined check-in system for tracking attendance and achievements with real-time updates.",
    icon: BadgeCheck,
  },
  {
    id: "2",
    name: "Freetime Matcher",
    description: "Intelligent scheduling tool for matching availability and coordinating team meetings efficiently.",
    icon: CalendarCheck,
  },
  {
    id: "3",
    name: "Messaging Hub",
    description: "Unified communication platform for seamless team messaging and broadcast announcements.",
    icon: Mail,
  },
];

const IT = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navigation />

      {/* Colorful Background Elements - Matching Production Page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F16001]/5 via-orange-50/30 to-amber-50/20" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#F16001]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-[#F16001]/5 rounded-full blur-3xl" />
      </div>

      {/* Cover Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#333333] mb-6">
              IT Projects
            </h1>
            <p className="text-lg sm:text-xl text-[#333333]/70 max-w-2xl mx-auto">
              Explore our portfolio of innovative digital solutions designed to streamline workflows and enhance productivity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid - Cards link to detail page */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const IconComponent = project.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={`/it/project/${project.id}`}
                    className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Project Icon Cover */}
                    <div className="aspect-square bg-gradient-to-br from-[#F16001]/5 via-orange-50 to-amber-50/50 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <IconComponent
                        className="w-20 h-20 text-[#F16001]/70 group-hover:text-[#F16001] group-hover:scale-110 transition-all duration-300"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-[#333333] group-hover:text-[#F16001] transition-colors">
                          {project.name}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-[#333333]/40 group-hover:text-[#F16001] group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-[#333333]/70 text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* View More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-end mt-12"
          >
            <a href="/it/archive" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-[#F16001] hover:bg-[#d95601] text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <FloatingChatButton />
    </div>
  );
};

export default IT;