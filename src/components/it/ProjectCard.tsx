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
  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`group bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 h-full flex flex-col ${className}`}>
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
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-[hsl(var(--ds-chocolate))] group-hover:text-primary mb-3">{name}</h3>
        <p className="text-foreground/70 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{description}</p>
        
        {/* Two side-by-side action buttons */}
        <div className="flex gap-3 mt-auto">
          <Link to={`/it/project/${id}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground font-semibold rounded-xl"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleVisitClick}
            className="flex-1 bg-primary hover:bg-[hsl(var(--ds-red-orange))] text-primary-foreground font-semibold rounded-xl"
          >
            <Globe className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
