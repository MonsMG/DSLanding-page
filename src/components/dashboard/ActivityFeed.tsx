import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    user: "John Doe",
    avatar: "JD",
    action: "completed task",
    target: "Homepage Redesign",
    time: "2 min ago",
  },
  {
    id: 2,
    user: "Sarah Chen",
    avatar: "SC",
    action: "created project",
    target: "Mobile App v2",
    time: "15 min ago",
  },
  {
    id: 3,
    user: "Mike Wilson",
    avatar: "MW",
    action: "commented on",
    target: "API Integration",
    time: "1 hour ago",
  },
  {
    id: 4,
    user: "Emily Park",
    avatar: "EP",
    action: "updated status of",
    target: "Database Migration",
    time: "2 hours ago",
  },
  {
    id: 5,
    user: "Alex Turner",
    avatar: "AT",
    action: "deployed",
    target: "Production Build",
    time: "3 hours ago",
  },
];

const ActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse ring-2 ring-orange-200" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${activity.avatar}`}
                  />
                  <AvatarFallback>{activity.avatar}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    {activity.user}
                  </span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-orange-600">
                    {activity.target}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-100">
        <button className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
          View all activity
        </button>
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
