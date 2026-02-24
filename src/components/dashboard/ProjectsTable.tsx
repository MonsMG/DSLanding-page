import { motion } from "framer-motion";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

type ProjectStatus =
  | "Active"
  | "In Progress"
  | "Pending"
  | "Completed"
  | "On Hold";

interface Project {
  id: number;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  team: string[];
  deadline: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    client: "TechCorp Inc.",
    status: "Active",
    progress: 75,
    team: ["JD", "SC", "MW"],
    deadline: "Jan 15, 2026",
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "StartupXYZ",
    status: "In Progress",
    progress: 45,
    team: ["EP", "AT"],
    deadline: "Feb 28, 2026",
  },
  {
    id: 3,
    name: "E-commerce Platform",
    client: "RetailMax",
    status: "Pending",
    progress: 20,
    team: ["JD", "MW", "EP", "AT"],
    deadline: "Mar 10, 2026",
  },
  {
    id: 4,
    name: "API Integration",
    client: "DataFlow Ltd",
    status: "Active",
    progress: 90,
    team: ["SC"],
    deadline: "Jan 20, 2026",
  },
  {
    id: 5,
    name: "Dashboard Analytics",
    client: "InsightPro",
    status: "In Progress",
    progress: 60,
    team: ["JD", "SC"],
    deadline: "Feb 05, 2026",
  },
  {
    id: 6,
    name: "Cloud Migration",
    client: "Enterprise Co",
    status: "On Hold",
    progress: 30,
    team: ["MW", "AT"],
    deadline: "Apr 15, 2026",
  },
];

const getStatusColor = (status: ProjectStatus) => {
  // All status dots are orange as per requirement
  return "bg-orange-500";
};

const ProjectsTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Active Projects</h3>
          <Button variant="outline" size="sm" className="text-gray-600">
            View All
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700">
                Project
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Client
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Progress
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Team
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Deadline
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="group hover:bg-gray-50/80 transition-colors cursor-pointer border-b border-gray-50"
              >
                <TableCell className="font-medium text-gray-900">
                  {project.name}
                </TableCell>
                <TableCell className="text-gray-600">
                  {project.client}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* Orange Status Dot with pulse animation */}
                    <span
                      className={`w-2.5 h-2.5 ${getStatusColor(project.status)} rounded-full animate-pulse ring-2 ring-orange-200`}
                    />
                    <span className="text-sm text-gray-700">
                      {project.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <Progress
                      value={project.progress}
                      className="h-2 flex-1 bg-gray-100 [&>div]:bg-orange-500"
                    />
                    <span className="text-xs text-gray-500 w-8">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, i) => (
                      <Avatar key={i} className="h-7 w-7 border-2 border-white">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${member}`}
                        />
                        <AvatarFallback className="text-xs">
                          {member}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="h-7 w-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          +{project.team.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {project.deadline}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ProjectsTable;
