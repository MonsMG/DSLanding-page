import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
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
  className = "",
}: ProjectCardProps) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Link to={`/it/project/${id}`} className={`block ${className}`}>
      <div className="group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
        {/* Project Icon Cover */}
        <div className="aspect-square bg-gradient-to-br from-primary/5 via-[hsl(var(--ds-cream))] to-[hsl(var(--ds-beige))] flex items-center justify-center relative overflow-hidden">
          <IconComponent
            className="w-20 h-20 text-primary/70 group-hover:text-primary group-hover:scale-110"
            strokeWidth={1.5}
          />
          {showCategory && category && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="text-xs bg-card/80">
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="p-6 flex flex-col flex-grow h-full">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-[hsl(var(--ds-chocolate))] group-hover:text-primary">{name}</h3>
          </div>
          <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3 mb-4">{description}</p>
          {/* Visit Website Button - Opens external link */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            className="w-full mt-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
          >
            <Globe className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
