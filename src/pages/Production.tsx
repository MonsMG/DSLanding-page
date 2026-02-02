import { motion } from "framer-motion";
import { Play, Camera, Film, Scissors, Image, Video } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Button } from "@/components/ui/button";

const services = [
  { icon: Video, label: "Video Production", description: "Professional video content from concept to final cut" },
  { icon: Camera, label: "Photography", description: "Stunning visuals that capture your brand essence" },
  { icon: Scissors, label: "Editing", description: "Expert post-production and color grading" },
];

const workItems = [
  { id: 1, type: "event", placeholder: "Corporate Event", category: "Events", span: "col-span-1 row-span-1" },
  { id: 2, type: "video", placeholder: "Tutorial Series", category: "Tutorial Clips", span: "col-span-1 row-span-2" },
  { id: 3, type: "image", placeholder: "Product Showcase", category: "Still Images", span: "col-span-1 row-span-1" },
  { id: 4, type: "event", placeholder: "Wedding Coverage", category: "Events", span: "col-span-2 row-span-1" },
  { id: 5, type: "video", placeholder: "How-To Guide", category: "Tutorial Clips", span: "col-span-1 row-span-1" },
  { id: 6, type: "image", placeholder: "Portrait Session", category: "Still Images", span: "col-span-1 row-span-1" },
];

const behindScenes = [
  { id: 1, placeholder: "On Set", description: "Capturing the magic" },
  { id: 2, placeholder: "Team Meeting", description: "Creative brainstorming" },
  { id: 3, placeholder: "Equipment Setup", description: "Preparation phase" },
  { id: 4, placeholder: "Post-Production", description: "Final touches" },
  { id: 5, placeholder: "Location Scout", description: "Finding the perfect spot" },
  { id: 6, placeholder: "Client Review", description: "Collaboration time" },
];

const productionGear = [
  { id: 1, name: "Sony FX6", category: "Cinema Camera" },
  { id: 2, name: "Canon R5", category: "Mirrorless" },
  { id: 3, name: "DJI Ronin 4D", category: "Gimbal System" },
  { id: 4, name: "Aputure 600D", category: "LED Lighting" },
  { id: 5, name: "Zoom F8n Pro", category: "Audio Recorder" },
  { id: 6, name: "DJI Mavic 3", category: "Drone" },
];

const Production = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Colorful Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <section className="relative pt-28 pb-12 overflow-hidden">
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
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground">
              DS Production Studio
            </h1>
          </motion.div>
        </div>
      </section>

      {/* OUR WORK Section - Masonry Grid */}
      <section className="relative z-10 py-16 px-6">
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

          {/* Masonry-style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
            {workItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`group relative capsule-card overflow-hidden cursor-pointer ${item.span}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {item.type === "video" ? (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors mb-3">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  ) : item.type === "event" ? (
                    <Film className="w-12 h-12 text-primary/60 group-hover:text-primary transition-colors mb-3" />
                  ) : (
                    <Image className="w-12 h-12 text-primary/60 group-hover:text-primary transition-colors mb-3" />
                  )}
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{item.category}</span>
                  <span className="text-base font-semibold text-foreground mt-2 text-center">{item.placeholder}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section - Card Layout */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="capsule-card p-8 text-center group hover:shadow-glow transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <service.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.label}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
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
                className="aspect-square capsule-card flex flex-col items-center justify-center p-6 group cursor-pointer bg-gradient-to-br from-primary/5 to-accent/10"
              >
                <Camera className="w-10 h-10 text-primary/50 group-hover:text-primary transition-colors mb-4" />
                <span className="text-base font-semibold text-foreground mb-1">{item.placeholder}</span>
                <span className="text-sm text-muted-foreground">{item.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Production Gear Section */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              Equipment
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Our Production Gear
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {productionGear.map((gear, index) => (
              <motion.div
                key={gear.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="capsule-card p-6 text-center group hover:shadow-medium transition-all"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Video className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{gear.name}</h4>
                <span className="text-xs text-muted-foreground">{gear.category}</span>
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
