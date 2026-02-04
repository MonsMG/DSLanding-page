import { Link } from "react-router-dom";
import { BadgeCheck, CalendarCheck, Mail, ArrowRight, Code, Server, Palette, LineChart, Database } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/it/ProjectCard";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
  icon: LucideIcon;
}

interface Skill {
  name: string;
  icon: LucideIcon;
  description: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "Check-in System",
    link: "https://check-it-ouch.lovable.app/",
    description:
      "A streamlined check-in system for tracking attendance and achievements with real-time updates.",
    icon: BadgeCheck,
  },
  {
    id: "2",
    name: "Freetime Matcher",
    link: "https://ft-matcher.lovable.app/",
    description:
      "Intelligent scheduling tool for matching availability and coordinating team meetings efficiently.",
    icon: CalendarCheck,
  },
  {
    id: "3",
    name: "Messaging Hub",
    link: "https://tagcast-connect.lovable.app",
    description:
      "Unified communication platform for seamless team messaging and broadcast announcements.",
    icon: Mail,
  },
];

const skills: Skill[] = [
  {
    name: "Front-End Development",
    icon: Code,
    description: "React, TypeScript, Tailwind CSS, responsive design",
  },
  {
    name: "Back-End Development",
    icon: Server,
    description: "Node.js, APIs, database integration, cloud services",
  },
  {
    name: "UI/UX Design",
    icon: Palette,
    description: "User research, wireframing, prototyping, design systems",
  },
  {
    name: "System Analyst",
    icon: Database,
    description: "Requirements analysis, system architecture, documentation",
  },
  {
    name: "Data Science",
    icon: LineChart,
    description: "Data analysis, visualization, machine learning basics",
  },
];

const IT = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Colorful Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-beige))] to-[hsl(var(--ds-cream))]" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[hsl(var(--ds-red-orange))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section with Main Slogan */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[hsl(var(--ds-chocolate))] mb-6">
              "Designed to Solve. Built to Improve."
            </h1>
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto">
              Crafting innovative digital solutions that streamline workflows and enhance productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Section A: Technical Skills */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 text-center">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {skills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-[hsl(var(--ds-chocolate))] mb-2">
                    {skill.name}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section B: Software Projects */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--ds-chocolate))] mb-10 text-center">
            Software Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                link={project.link}
                description={project.description}
                icon={project.icon}
              />
            ))}
          </div>

          {/* View More Archive Button */}
          <div className="flex justify-end mt-12">
            <Link to="/it/archive">
              <Button
                size="lg"
                className="bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl"
              >
                View More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FloatingChatButton />
    </div>
  );
};

export default IT;
