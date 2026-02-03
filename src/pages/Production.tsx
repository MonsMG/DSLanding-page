import { Link } from "react-router-dom";
import { Play, Camera, Film, Scissors, Image, Video, ArrowRight } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";
import { Button } from "@/components/ui/button";
const services = [{
  icon: Video,
  label: "Video Production",
  description: "Professional video content from concept to final cut"
}, {
  icon: Camera,
  label: "Photography",
  description: "Stunning visuals that capture your brand essence"
}, {
  icon: Scissors,
  label: "Editing",
  description: "Expert post-production and color grading"
}];
const workItems = [{
  id: 1,
  type: "event",
  placeholder: "Corporate Event",
  category: "Events",
  span: "col-span-1 row-span-1"
}, {
  id: 2,
  type: "video",
  placeholder: "Tutorial Series",
  category: "Tutorial Clips",
  span: "col-span-1 row-span-2"
}, {
  id: 3,
  type: "image",
  placeholder: "Product Showcase",
  category: "Still Images",
  span: "col-span-1 row-span-1"
}, {
  id: 4,
  type: "event",
  placeholder: "Wedding Coverage",
  category: "Events",
  span: "col-span-2 row-span-1"
}, {
  id: 5,
  type: "video",
  placeholder: "How-To Guide",
  category: "Tutorial Clips",
  span: "col-span-1 row-span-1"
}, {
  id: 6,
  type: "image",
  placeholder: "Portrait Session",
  category: "Still Images",
  span: "col-span-1 row-span-1"
}];
const behindScenes = [{
  id: 1,
  placeholder: "On Set",
  description: "Capturing the magic"
}, {
  id: 2,
  placeholder: "Team Meeting",
  description: "Creative brainstorming"
}, {
  id: 3,
  placeholder: "Equipment Setup",
  description: "Preparation phase"
}, {
  id: 4,
  placeholder: "Post-Production",
  description: "Final touches"
}, {
  id: 5,
  placeholder: "Location Scout",
  description: "Finding the perfect spot"
}, {
  id: 6,
  placeholder: "Client Review",
  description: "Collaboration time"
}];
const productionGear = [{
  id: 1,
  name: "Sony FX6",
  category: "Cinema Camera"
}, {
  id: 2,
  name: "Canon R5",
  category: "Mirrorless"
}, {
  id: 3,
  name: "DJI Ronin 4D",
  category: "Gimbal System"
}, {
  id: 4,
  name: "Aputure 600D",
  category: "LED Lighting"
}, {
  id: 5,
  name: "Zoom F8n Pro",
  category: "Audio Recorder"
}, {
  id: 6,
  name: "DJI Mavic 3",
  category: "Drone"
}];
const Production = () => {
  return <div className="min-h-screen bg-white relative overflow-hidden">
      <Navigation />

      {/* Colorful Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F16001]/5 via-orange-50/30 to-white" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#F16001]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-[#F16001]/5 rounded-full blur-3xl" />
      </div>

      {/* Cover Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#333333] mb-6">
              DS Studio
            </h1>
            
            <p className="text-[#333333]/60 max-w-2xl mx-auto text-xl">
              Professional production services for your creative vision
            </p>
          </div>
        </div>
      </section>

      {/* OUR WORK Section - Masonry Grid */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#F16001] mb-4 block uppercase tracking-widest">
              Portfolio
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#333333]">OUR WORK</h2>
          </div>

          {/* Masonry-style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
            {workItems.map(item => <div key={item.id} className={`group relative bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg ${item.span}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#F16001]/5 via-orange-50 to-white" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#333333]/10 to-transparent opacity-0 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {item.type === "video" ? <div className="w-16 h-16 rounded-full bg-[#F16001]/10 flex items-center justify-center group-hover:bg-[#F16001]/20 mb-3">
                      <Play className="w-8 h-8 text-[#F16001] ml-1" />
                    </div> : item.type === "event" ? <Film className="w-12 h-12 text-[#F16001]/60 group-hover:text-[#F16001] mb-3" /> : <Image className="w-12 h-12 text-[#F16001]/60 group-hover:text-[#F16001] mb-3" />}
                  <span className="text-xs font-semibold text-[#F16001] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-base font-semibold text-[#333333] mt-2 text-center">
                    {item.placeholder}
                  </span>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* WE'RE CREATE / Services Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#F16001] mb-4 block uppercase tracking-widest">
              What We Do
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#333333]">WE'RE CREATE</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {services.map(service => <div key={service.label} className="bg-white border border-gray-100 rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-1">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#F16001]/10 to-orange-50 flex items-center justify-center mb-6 group-hover:from-[#F16001]/20">
                  <service.icon className="w-10 h-10 text-[#F16001]" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">{service.label}</h3>
                <p className="text-[#333333]/70">{service.description}</p>
              </div>)}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="border-[#F16001] text-[#F16001] hover:bg-[#F16001] hover:text-white px-8 py-6 text-base font-semibold rounded-xl">
              More Details
            </Button>
          </div>
        </div>
      </section>

      {/* BEHIND THE SCENE Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#F16001] mb-4 block uppercase tracking-widest">
              Life at DS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#333333]">BEHIND THE SCENE</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {behindScenes.map(item => <div key={item.id} className="aspect-square bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center p-6 group cursor-pointer hover:shadow-lg">
                <Camera className="w-10 h-10 text-[#F16001]/50 group-hover:text-[#F16001] mb-4" />
                <span className="text-base font-semibold text-[#333333] mb-1">{item.placeholder}</span>
                <span className="text-sm text-[#333333]/60">{item.description}</span>
              </div>)}
          </div>
        </div>
      </section>

      {/* Our Production Gear Section */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-[#F16001]/5 via-white to-orange-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-[#F16001] mb-4 block uppercase tracking-widest">
              Equipment
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#333333]">Our Production Gear</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {productionGear.map(gear => <div key={gear.id} className="bg-white border border-gray-100 rounded-2xl p-6 text-center group hover:shadow-lg">
                <div className="w-14 h-14 mx-auto rounded-xl bg-[#F16001]/10 flex items-center justify-center mb-4 group-hover:bg-[#F16001]/20">
                  <Video className="w-7 h-7 text-[#F16001]" />
                </div>
                <h4 className="font-semibold text-[#333333] text-sm mb-1">{gear.name}</h4>
                <span className="text-xs text-[#333333]/60">{gear.category}</span>
              </div>)}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="border-[#F16001] text-[#F16001] hover:bg-[#F16001] hover:text-white px-8 py-6 text-base font-semibold rounded-xl">
              View All Gear
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#333333] mb-6">
              Would you like to work with us?
            </h2>
            <p className="text-lg text-[#333333]/70 mb-10 max-w-2xl mx-auto">
              Let's create something amazing together. Reach out to discuss your next project.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-[#F16001] hover:bg-[#d95601] text-white px-10 py-7 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl">
                Contact Us
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FloatingChatButton />
    </div>;
};
export default Production;