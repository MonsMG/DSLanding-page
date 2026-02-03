import { Sparkles, Target, Users, Heart } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";

const stats = [
  { value: "50+", label: "Projects Completed" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Team Members" },
];

const values = [
  {
    icon: Sparkles,
    title: "Innovation",
    description: "We push boundaries and embrace new technologies to deliver cutting-edge solutions.",
  },
  {
    icon: Target,
    title: "Quality",
    description: "Every project receives our full attention to detail and commitment to excellence.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work closely with our clients to understand their vision and bring it to life.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our love for what we do drives us to create exceptional digital experiences.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />

      {/* Decorative Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute top-32 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-48 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              About DS Workspace
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a creative digital studio dedicated to transforming ideas into 
              exceptional digital experiences. Our passion drives innovation, and 
              our expertise delivers results that exceed expectations.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="capsule-card p-8 text-center">
                <span className="text-4xl sm:text-5xl font-bold text-primary block mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="capsule-card p-12 sm:p-16 text-center mb-20">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Empowering Digital Excellence
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              To empower businesses and individuals with innovative digital solutions 
              that not only meet their needs but exceed their expectations. We believe 
              in the power of technology to transform, connect, and inspire people around the world.
            </p>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary mb-4 block uppercase tracking-widest">
              What We Stand For
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {values.map((value) => (
              <div key={value.title} className="capsule-card p-8 group">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Brand */}
          <div className="text-center">
            <div className="capsule-card p-16 inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-6xl sm:text-7xl font-bold text-foreground">DS</span>
                <span className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <p className="text-lg text-muted-foreground font-medium">
                Digital Solution Workspace
              </p>
            </div>
          </div>
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default About;
