import { motion } from "framer-motion";
import { FolderKanban, Clock, CheckCircle, AlertCircle } from "lucide-react";

const stats = [
  {
    label: "Total Projects",
    value: "12",
    change: "+2 this month",
    icon: FolderKanban,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Pending Tasks",
    value: "24",
    change: "8 due today",
    icon: Clock,
    color: "bg-orange-50 text-orange-600",
  },
  {
    label: "Completed",
    value: "156",
    change: "+12 this week",
    icon: CheckCircle,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Issues",
    value: "3",
    change: "Needs attention",
    icon: AlertCircle,
    color: "bg-red-50 text-red-600",
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
