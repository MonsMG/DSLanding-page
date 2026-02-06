import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import Hero from "@/components/home/Hero";

const Index = () => {
  return (
    <div className="h-screen overflow-hidden bg-background">
      <Navigation />
      <Hero />
      <FloatingChatButton />
    </div>
  );
};

export default Index;
