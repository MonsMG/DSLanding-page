import { motion } from "framer-motion";
import { Play, Camera, Film, Mic, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import FloatingElements from "@/components/home/FloatingElements";

const services = [
  { icon: Film, label: "Video Production" },
  { icon: Camera, label: "Photography" },
  { icon: Mic, label: "Audio Recording" },
  { icon: Lightbulb, label: "Creative Direction" },
];

const workItems = [
  { id: 1, type: "image", placeholder: "Commercial Shoot" },
  { id: 2, type: "video", placeholder: "Brand Story" },
  { id: 3, type: "image", placeholder: "Product Photography" },
  { id: 4, type: "video", placeholder: "Event Coverage" },
  { id: 5, type: "image", placeholder: "Portrait Session" },
  { id: 6, type: "image", placeholder: "Editorial Work" },
];

const behindScenes = [
  { id: 1, placeholder: "On Set" },
  { id: 2, placeholder: "Team Meeting" },
  { id: 3, placeholder: "Equipment Setup" },
  { id: 4, placeholder: "Post-Production" },
];

const gear = [
  { id: 1, placeholder: "Camera Equipment" },
  { id: 2, placeholder: "Lighting Setup" },
  { id: 3, placeholder: "Audio Gear" },
  { id: 4, placeholder: "Drone Kit" },
];

const Production = () => {
  return (
    <div className="min-h-screen bg-background hero-gradient relative overflow-hidden">
      <FloatingElements />
      <Navigation />

      {/* Our Work Gallery - Immediately visible */}
      <section className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <span className="text-sm font-medium text-muted-foreground">
                Visual Storytelling
              </span>
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Our Work
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our portfolio of visual storytelling.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative aspect-[4/3] glass-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.type === "video" ? (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  ) : (
                    <Camera className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-sm font-medium text-foreground/80">{item.placeholder}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* We Create Services */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary mb-4 block uppercase tracking-wider">
              Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              WE CREATE
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {services.map((service, index) => (
              <motion.div
                key={service.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl glass-card text-center group hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="font-medium text-foreground">{service.label}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              variant="outline" 
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary"
            >
              Other Services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Behind The Scene */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary mb-4 block uppercase tracking-wider">
              Life at DS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              BEHIND THE SCENE
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {behindScenes.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-square glass-card rounded-2xl flex items-center justify-center"
              >
                <span className="text-sm font-medium text-foreground/60">{item.placeholder}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Production Gear */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary mb-4 block uppercase tracking-wider">
              Equipment
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Our Production Gear
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {gear.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="aspect-[4/3] glass-card rounded-2xl flex items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <span className="text-sm font-medium text-foreground/60">{item.placeholder}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              variant="outline" 
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary"
            >
              View More
            </Button>
          </motion.div>
        </div>
      </section>

      <FloatingChatButton />
    </div>
  );
};

export default Production;
