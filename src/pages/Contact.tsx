import { motion } from "framer-motion";
import { Mail, Facebook } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "ds_studio@gmail.com",
    href: "mailto:ds_studio@gmail.com",
    description: "We reply within 24 hours",
  },
  {
    icon: Facebook,
    title: "Facebook",
    value: "DS Workspace",
    href: "https://www.facebook.com/share/1Aryrru3t1/?mibextid=wwXIfr",
    description: "Follow us for updates",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Decorative Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute top-32 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-32 right-10 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Get in Touch
              </span>
            </motion.span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Contact Us
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
              Have a project in mind? Reach out to us through any of the channels below.
            </p>
          </motion.div>

          {/* Contact Cards - Centered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.href}
                target={method.title === "Facebook" ? "_blank" : undefined}
                rel={method.title === "Facebook" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="capsule-card p-8 text-center group"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <method.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {method.title}
                </h3>
                
                <p className="text-primary font-medium mb-2 group-hover:underline">
                  {method.value}
                </p>
                
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </motion.a>
            ))}
          </div>

          {/* Office Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 capsule-card p-10 text-center"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Office Hours
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-muted-foreground max-w-md mx-auto">
              <div className="capsule-card p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <p className="font-semibold text-foreground mb-2">Monday - Friday</p>
                <p className="text-lg">08:30 AM - 16:30 PM</p>
              </div>
              <div className="capsule-card p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <p className="font-semibold text-foreground mb-2">Saturday</p>
                <p className="text-lg">10:00 AM - 17:00 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default Contact;
