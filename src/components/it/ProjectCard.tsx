import { Link } from "react-router-dom";
import { Globe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface ProjectCardProps {
  id: string;
  name: string;
  link: string;
  description: string;
  icon: LucideIcon;
  category?: string;
  showCategory?: boolean;
  compact?: boolean;
  className?: string;
}

const ProjectCard = ({
  id,
  name,
  link,
  description,
  icon: IconComponent,
  category,
  showCategory = false,
  compact = false,
  className = "",
}: ProjectCardProps) => {
  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${className}`}
    >
      {/* Project Icon Cover */}
      <div
        className={`${
          compact ? "aspect-[4/3]" : "aspect-square"
        } bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-cream))] to-[hsl(var(--ds-beige))] flex items-center justify-center relative overflow-hidden`}
      >
        <IconComponent
          className={`${
            compact ? "w-14 h-14" : "w-20 h-20"
          } text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300`}
          strokeWidth={1.5}
        />
        {showCategory && category && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-card/90 px-2 py-0.5">
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className={`${compact ? "p-4" : "p-6"} flex flex-col flex-1`}>
        <h3
          className={`${
            compact ? "text-base" : "text-xl"
          } font-bold text-[hsl(var(--ds-chocolate))] group-hover:text-primary transition-colors mb-2`}
        >
          {name}
        </h3>
        <p
          className={`text-foreground/70 ${
            compact ? "text-xs" : "text-sm"
          } leading-relaxed line-clamp-2 mb-3 flex-1`}
        >
          {description}
        </p>

        {/* Two side-by-side action buttons */}
        <div className={`flex gap-2 mt-auto`}>
          <Link to={`/it/project/${id}`} className="flex-1">
            <Button
              size="sm"
              className={`w-full bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground font-semibold ${
                compact ? "rounded-lg text-xs h-8" : "rounded-xl"
              }`}
            >
              <Eye className={`${compact ? "w-3 h-3" : "w-4 h-4"} mr-1.5`} />
              View Details
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleVisitClick}
            className={`flex-1 bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground font-semibold ${
              compact ? "rounded-lg text-xs h-8" : "rounded-xl"
            }`}
          >
            <Globe className={`${compact ? "w-3 h-3" : "w-4 h-4"} mr-1.5`} />
            Visit Website
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
