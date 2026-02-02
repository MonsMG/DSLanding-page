import { motion } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import FloatingElements from "@/components/home/FloatingElements";

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Team Members" },
];

const values = [
  {
    title: "Innovation",
    description: "We push boundaries and embrace new technologies to deliver cutting-edge solutions.",
  },
  {
    title: "Quality",
    description: "Every project receives our full attention to detail and commitment to excellence.",
  },
  {
    title: "Collaboration",
    description: "We work closely with our clients to understand their vision and bring it to life.",
  },
  {
    title: "Integrity",
    description: "Transparency and honesty guide every interaction and decision we make.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background hero-gradient relative overflow-hidden">
      <FloatingElements />
      <Navigation />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <span className="text-sm font-medium text-muted-foreground">
                Our Story
              </span>
            </motion.span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              About DS Studio
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are a creative digital agency dedicated to transforming ideas into 
              exceptional digital experiences. Our passion drives innovation, and 
              our expertise delivers results.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 text-center"
              >
                <span className="text-4xl font-bold text-primary block mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12 text-center mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To empower businesses and individuals with innovative digital solutions 
              that not only meet their needs but exceed their expectations. We believe 
              in the power of technology to transform, connect, and inspire.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-primary mb-4 block uppercase tracking-wider">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 group hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="glass-card p-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-foreground">DS</span>
              </div>
              <p className="text-muted-foreground">
                Digital Solution Studio
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default About;
