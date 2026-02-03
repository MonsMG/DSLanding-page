import { Mail, Facebook, Phone } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import FloatingChatButton from "@/components/layout/FloatingChatButton";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    value: "+66 XX XXX XXXX",
    href: "tel:+66XXXXXXXX",
    description: "Call us during office hours",
  },
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
    value: "Digital Solution Studio",
    href: "https://www.facebook.com/share/1Aryrru3t1/?mibextid=wwXIfr",
    description: "Follow us for updates",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navigation />

      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#F16001]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-50 to-transparent rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#333333] mb-6">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl text-[#333333]/70 max-w-xl mx-auto">
              Have a project in mind? Reach out to us through any of the channels below.
            </p>
          </div>

          {/* Contact Cards - Centered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.href}
                target={method.title === "Facebook" ? "_blank" : undefined}
                rel={method.title === "Facebook" ? "noopener noreferrer" : undefined}
                className="bg-white border border-gray-100 rounded-3xl p-8 text-center group hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto sm:min-w-[200px]"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F16001]/10 flex items-center justify-center mb-6 group-hover:bg-[#F16001]/20">
                  <method.icon className="w-7 h-7 text-[#F16001]" />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">{method.title}</h3>
                <p className="text-[#F16001] font-medium mb-2 group-hover:underline">{method.value}</p>
                <p className="text-sm text-[#333333]/60">{method.description}</p>
              </a>
            ))}
          </div>

          {/* Office Hours Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-[#333333] mb-6">Office Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#333333]/70 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-[#F16001]/5 to-orange-50/50 rounded-2xl p-6">
                <p className="font-semibold text-[#333333] mb-2">Monday - Friday</p>
                <p className="text-lg">08:30 AM - 16:30 PM</p>
              </div>
              <div className="bg-gradient-to-br from-[#F16001]/5 to-orange-50/50 rounded-2xl p-6">
                <p className="font-semibold text-[#333333] mb-2">Saturday</p>
                <p className="text-lg">10:00 AM - 17:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingChatButton />
    </div>
  );
};

export default Contact;
