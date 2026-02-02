import { motion } from "framer-motion";
import { Play, Camera, Film, Scissors, Image } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";

const services = [
  { icon: Film, label: "Video Production" },
  { icon: Camera, label: "Photography" },
  { icon: Scissors, label: "Editing" },
  { icon: Film, label: "Video Production" },
  { icon: Camera, label: "Photography" },
  { icon: Scissors, label: "Editing" },
];

const workItems = [
  { id: 1, type: "event", placeholder: "Corporate Event", category: "Events" },
  { id: 2, type: "video", placeholder: "Tutorial Series", category: "Tutorial Clips" },
  { id: 3, type: "image", placeholder: "Product Showcase", category: "Still Images" },
  { id: 4, type: "event", placeholder: "Wedding Coverage", category: "Events" },
  { id: 5, type: "video", placeholder: "How-To Guide", category: "Tutorial Clips" },
  { id: 6, type: "image", placeholder: "Portrait Session", category: "Still Images" },
];

const behindScenes = [
  { id: 1, placeholder: "On Set", description: "Capturing the magic" },
  { id: 2, placeholder: "Team Meeting", description: "Creative brainstorming" },
  { id: 3, placeholder: "Equipment Setup", description: "Preparation phase" },
  { id: 4, placeholder: "Post-Production", description: "Final touches" },
  { id: 5, placeholder: "Location Scout", description: "Finding the perfect spot" },
  { id: 6, placeholder: "Client Review", description: "Collaboration time" },
];

const Production = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Header Section */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        {/* Decorative Elements */}
        <div className="absolute top-32 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-48 right-16 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Visual Storytelling
              </span>
            </motion.span>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4">
              DS Studio
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
              We are DS Studio, Not just a simple studio
            </p>
          </motion.div>
        </div>
      </section>

      {/* OUR WORK Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              Portfolio
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              OUR WORK
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative aspect-[4/3] capsule-card overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {item.type === "video" ? (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors mb-3">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  ) : item.type === "event" ? (
                    <Film className="w-12 h-12 text-primary/50 group-hover:text-primary/70 transition-colors mb-3" />
                  ) : (
                    <Image className="w-12 h-12 text-primary/50 group-hover:text-primary/70 transition-colors mb-3" />
                  )}
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{item.category}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-base font-semibold text-foreground">{item.placeholder}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section - Marquee Style */}
      <section className="relative z-10 py-20 overflow-hidden bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              What We Do
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Our Services
            </h2>
          </motion.div>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          <div className="flex overflow-hidden">
            <div className="flex marquee">
              {[...services, ...services].map((service, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-4 p-8 rounded-3xl glass-card text-center min-w-[200px] group hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-lg">{service.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEHIND THE SCENE Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              Life at DS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              BEHIND THE SCENE
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {behindScenes.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-square capsule-card flex flex-col items-center justify-center p-6 group cursor-pointer"
              >
                <Camera className="w-10 h-10 text-primary/40 group-hover:text-primary/60 transition-colors mb-4" />
                <span className="text-base font-semibold text-foreground mb-1">{item.placeholder}</span>
                <span className="text-sm text-muted-foreground">{item.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FloatingChatButton />
    </div>
  );
};

export default Production;
