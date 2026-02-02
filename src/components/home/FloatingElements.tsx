import { motion } from "framer-motion";

const FloatingElements = () => {
  const elements = [
    {
      id: 1,
      size: "w-24 h-24 sm:w-32 sm:h-32",
      position: "top-20 left-[10%]",
      delay: 0,
      gradient: "from-primary/20 to-accent/20",
      shape: "rounded-3xl",
    },
    {
      id: 2,
      size: "w-16 h-16 sm:w-20 sm:h-20",
      position: "top-32 right-[15%]",
      delay: 0.5,
      gradient: "from-secondary to-muted",
      shape: "rounded-full",
    },
    {
      id: 3,
      size: "w-20 h-20 sm:w-28 sm:h-28",
      position: "bottom-40 left-[20%]",
      delay: 1,
      gradient: "from-primary/30 to-accent/10",
      shape: "rounded-2xl rotate-12",
    },
    {
      id: 4,
      size: "w-14 h-14 sm:w-16 sm:h-16",
      position: "bottom-32 right-[25%]",
      delay: 1.5,
      gradient: "from-muted to-secondary",
      shape: "rounded-full",
    },
    {
      id: 5,
      size: "w-10 h-10 sm:w-12 sm:h-12",
      position: "top-1/2 left-[5%]",
      delay: 2,
      gradient: "from-primary/40 to-primary/10",
      shape: "rounded-xl -rotate-12",
    },
    {
      id: 6,
      size: "w-8 h-8 sm:w-10 sm:h-10",
      position: "top-40 right-[8%]",
      delay: 0.8,
      gradient: "from-accent/30 to-primary/10",
      shape: "rounded-lg rotate-45",
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: element.delay,
            duration: 1,
            ease: "easeOut",
          }}
          className={`absolute ${element.position} ${element.size} ${element.shape} bg-gradient-to-br ${element.gradient} backdrop-blur-sm border border-border/30`}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 5 + element.id * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay,
            }}
          />
        </motion.div>
      ))}

      {/* Large decorative circle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/5 to-transparent blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-accent/5 to-transparent blur-3xl"
      />
    </div>
  );
};

export default FloatingElements;
