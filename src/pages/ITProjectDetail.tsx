import { useParams, Link } from "react-router-dom";
import { Globe, ArrowLeft, Users, CheckCircle } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
  fullDescription: string;
  targetAudience: string[];
  features: string[];
}

const projectsData: Record<string, Project> = {
  "1": {
    id: "1",
    name: "Check-in System",
    link: "https://check-it-ouch.lovable.app/",
    description: "A streamlined check-in system for tracking attendance and achievements with real-time updates.",
    fullDescription:
      "Our Check-in System is a comprehensive solution designed for organizations that need to track attendance and monitor participant achievements in real-time. Built with modern web technologies, it offers a seamless experience for both administrators and users. The system includes features like QR code scanning, automated reporting, and integration capabilities with existing HR systems.",
    targetAudience: [
      "Corporate HR departments",
      "Educational institutions",
      "Event organizers",
      "Conference managers",
      "Training facilities",
    ],
    features: [
      "Real-time attendance tracking",
      "QR code check-in capability",
      "Automated achievement badges",
      "Comprehensive analytics dashboard",
      "Export reports in multiple formats",
    ],
  },
  "2": {
    id: "2",
    name: "Freetime Matcher",
    link: "https://ft-matcher.lovable.app/",
    description: "Intelligent scheduling tool for matching availability and coordinating team meetings efficiently.",
    fullDescription:
      "Freetime Matcher revolutionizes the way teams coordinate their schedules. This intelligent scheduling tool analyzes team members' availability and automatically suggests optimal meeting times. Say goodbye to endless email chains trying to find a suitable slot - our algorithm does the heavy lifting, ensuring maximum participation while respecting individual preferences and time zones.",
    targetAudience: [
      "Remote and hybrid teams",
      "Project managers",
      "HR coordinators",
      "Academic advisors",
      "Freelancers and consultants",
    ],
    features: [
      "Smart availability matching algorithm",
      "Multi-timezone support",
      "Calendar integration (Google, Outlook)",
      "Recurring meeting optimization",
      "Team preference learning",
    ],
  },
  "3": {
    id: "3",
    name: "Messaging Hub",
    link: "https://tagcast-connect.lovable.app",
    description: "Unified communication platform for seamless team messaging and broadcast announcements.",
    fullDescription:
      "Messaging Hub serves as your organization's central communication nerve center. This unified platform enables seamless team messaging, broadcast announcements, and targeted communication channels. With features like scheduled messages, read receipts, and department-specific channels, keeping your team informed has never been easier or more efficient.",
    targetAudience: [
      "Medium to large enterprises",
      "Educational institutions",
      "Non-profit organizations",
      "Government agencies",
      "Multi-location businesses",
    ],
    features: [
      "Broadcast messaging to groups",
      "Scheduled message delivery",
      "Read receipt tracking",
      "Department-specific channels",
      "Priority message flagging",
    ],
  },
};

const ITProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? projectsData[projectId] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Project Not Found</h1>
          <Link to="/it">
            <Button className="bg-[#F16001] hover:bg-[#d95601] text-white">Back to IT Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#F16001]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-50 to-transparent rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div>
            <Link to="/it" className="inline-flex items-center gap-2 text-[#333333]/70 hover:text-[#F16001] mb-8">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Projects</span>
            </Link>
          </div>

          {/* Project Header */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333]">{project.name}</h1>
          </div>

          {/* Visit Website CTA */}
          <div className="mb-12 text-left">
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button
                size="lg"
                className="bg-[#F16001] hover:bg-[#d95601] text-white px-10 py-7 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl"
              >
                <Globe className="w-5 h-5 mr-3" />
                Visit Website
              </Button>
            </a>
          </div>

          {/* Project Details Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-lg mb-10">
            {/* Full Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#333333] mb-4">About This Project</h2>
              <p className="text-[#333333]/80 leading-relaxed text-lg">{project.fullDescription}</p>
            </div>

            {/* Target Audience */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#F16001]" />
                <h2 className="text-2xl font-bold text-[#333333]">Who This Is For</h2>
              </div>
              <ul className="space-y-3">
                {project.targetAudience.map((audience, index) => (
                  <li key={index} className="flex items-center gap-3 text-[#333333]/80">
                    <div className="w-2 h-2 rounded-full bg-[#F16001]" />
                    {audience}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Features */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-[#F16001]" />
                <h2 className="text-2xl font-bold text-[#333333]">Key Features</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-[#333333]/80">
                    <div className="w-2 h-2 rounded-full bg-[#F16001]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default ITProjectDetail;
