// src/i18n/en.ts
import { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    home: "Home",
    software: "Software",
    production: "Production",
    about: "About",
    contact: "Contact",
  },
  home: {
    hero: {
      title: "Designed to Solve.\nBuilt to Improve.",
      subtitle: "Crafting innovative digital solutions that streamline workflows and enhance productivity.",
      button: "View Projects",
      exploreSoftware: "Explore Software",
      exploreProduction: "Explore Production",
      slogan: "From Vision to Digital Solution",
    },
    skillsTitle: "Technical Skills",
    projectsTitle: "Software Projects",
    archiveButton: "View More Archive",
  },
  projects: {
    "1": {
      id: "1",
      link: "https://check-it-ouch.lovable.app/",
      name: "Check-in System",
      desc: "A streamlined check-in system for tracking attendance and achievements.",
      fullDesc: "Our Check-in System is a comprehensive solution designed for organizations to track attendance and monitor participant achievements in real-time. Built with modern web technologies, it offers a seamless experience for both administrators and users. The system includes features like QR code scanning, automated reporting, and integration capabilities with existing HR systems.",
      target: [
        "Corporate HR departments",
        "Educational institutions",
        "Event organizers",
        "Conference managers",
        "Training facilities",
      ],
      features: [
        "Real-time attendance tracking",
        "QR code check-in capability",
        "Automated achievement badges",
        "Comprehensive analytics dashboard",
        "Export reports in multiple formats",
      ],
    },
    "2": {
      id: "2",
      link: "https://ft-matcher.lovable.app/",
      name: "Freetime Matcher",
      desc: "Intelligent scheduling tool for matching availability.",
      fullDesc: "Freetime Matcher revolutionizes the way teams coordinate their schedules. This intelligent scheduling tool analyzes team members' availability and automatically suggests optimal meeting times. Say goodbye to endless email chains trying to find a suitable slot - our algorithm does the heavy lifting, ensuring maximum participation while respecting individual preferences and time zones.",
      target: [
        "Remote and hybrid teams",
        "Project managers",
        "HR coordinators",
        "Academic advisors",
        "Freelancers and consultants",
      ],
      features: [
        "Smart availability matching algorithm",
        "Multi-timezone support",
        "Calendar integration (Google, Outlook)",
        "Recurring meeting optimization",
        "Team preference learning",
      ],
    },
    "3": {
      id: "3",
      link: "https://tagcast-connect.lovable.app",
      name: "Messaging Hub",
      desc: "Unified communication platform for team messaging.",
      fullDesc: "Messaging Hub serves as your organization's central communication nerve center. This unified platform enables seamless team messaging, broadcast announcements, and targeted communication channels. With features like scheduled messages, read receipts, and department-specific channels, keeping your team informed has never been easier or more efficient.",
      target: [
        "Medium to large enterprises",
        "Educational institutions",
        "Non-profit organizations",
        "Government agencies",
        "Multi-location businesses",
      ],
      features: [
        "Broadcast messaging to groups",
        "Scheduled message delivery",
        "Read receipt tracking",
        "Department-specific channels",
        "Priority message flagging",
      ],
    },
  },
  archive: {
    title: "Software Projects Archive",
    subtitle: "A complete collection of digital solutions and experiments.",
    backButton: "Back to Home",
    noResults: "No projects found matching your criteria.",
    allCategory: "All",
  },
  gearArchive: {
    title: "Production Gear Archive",
    subtitle: "A complete collection of our professional production equipment.",
    noResults: "No gear found matching your criteria.",
    allCategory: "All",
  },
  projectDetail: {
    backToProjects: "Back to Projects",
    visitWebsite: "Visit Website",
    aboutProject: "About This Project",
    forWhom: "Who This Is For",
    keyFeatures: "Key Features",
    projectNotFound: "Project Not Found",
    backToIT: "Back to IT Projects",
  },
  production: {
    heroTitle: "DS Production",
    heroSubtitle: "Professional production services for your creative vision",
    slogan: "We are DS Studio, Not just a simple studio.",
    sections: {
      work: "OUR WORK",
      workSubtitle: "Portfolio",
      create: "WE CREATE",
      createSubtitle: "What We Do",
      behind: "BEHIND THE SCENE",
      behindSubtitle: "Life at DS",
      gear: "Our Production Gear",
      gearSubtitle: "Equipment",
    },
    moreDetails: "More Details",
    viewAllGear: "View All Gear",
    services: {
      video: {
        label: "Video Production",
        description: "Professional video content from concept to final cut",
      },
      photography: {
        label: "Photography",
        description: "Stunning visuals that capture your brand essence",
      },
      editing: {
        label: "Editing",
        description: "Expert post-production and color grading",
      },
    },
    workItems: {
      event1: {
        placeholder: "Corporate Event",
        category: "Events",
      },
      video1: {
        placeholder: "Tutorial Series",
        category: "Tutorial Clips",
      },
      image1: {
        placeholder: "Product Showcase",
        category: "Still Images",
      },
      event2: {
        placeholder: "Wedding Coverage",
        category: "Events",
      },
      video2: {
        placeholder: "How-To Guide",
        category: "Tutorial Clips",
      },
      image2: {
        placeholder: "Portrait Session",
        category: "Still Images",
      },
    },
    behindScenes: {
      onSet: {
        placeholder: "On Set",
        description: "Capturing the magic",
        image_url: "https://scontent.fcnx1-1.fna.fbcdn.net/v/t39.30808-6/628030926_122137042910987911_9134088275520610199_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_ohc=A33vdZieuaMQ7kNvwFgfE5X&_nc_oc=AdmRojRDAcI811siW0r-EGbnf6v6D0XFQndM_xr0nj6cVNh7G7Taiw7vrRRoMmfUhwg&_nc_zt=23&_nc_ht=scontent.fcnx1-1.fna&_nc_gid=kVG6UYtRL4GhVxdGiDHm0w&oh=00_AfvL3nUeJdP5_v88j3qpy-HsxrflQnqvx6pMV5qntgv1Vg&oe=69A6E850",
      },
      teamMeeting: {
        placeholder: "Team Meeting",
        description: "Creative brainstorming",
        image_url: "",
      },
      equipmentSetup: {
        placeholder: "Equipment Setup",
        description: "Preparation phase",
        image_url: "",
      },
      postProduction: {
        placeholder: "Post-Production",
        description: "Final touches",
        image_url: "",
      },
      locationScout: {
        placeholder: "Location Scout",
        description: "Finding the perfect spot",
        image_url: "",
      },
      clientReview: {
        placeholder: "Client Review",
        description: "Collaboration time",
        image_url: "",
      },
    },
  },
  about: {
    title: "About DS Workspace",
    description: "We are a creative digital studio dedicated to transforming visionary ideas into seamless digital experiences. By blending innovation with deep technical expertise, we deliver impactful results that push boundaries and exceed expectations.",
    stats: {
      projects: {
        value: "50+",
        label: "Successful Projects",
      },
      clients: {
        value: "30+",
        label: "Trusted Partners",
      },
      experience: {
        value: "5+",
        label: "Years of Excellence",
      },
      team: {
        value: "10+",
        label: "Creative Experts",
      },
    },
    mission: {
      subtitle: "Our Mission",
      title: "Empowering Digital Excellence",
      description: "Our mission is to empower businesses with forward-thinking digital solutions that drive growth and inspire change. We believe in the power of technology to seamlessly connect people and transform how the world operates.",
    },
    values: {
      subtitle: "What We Stand For",
      title: "Our Core Values",
      items: {
        innovation: {
          title: "Innovation",
          description: "We constantly push boundaries and embrace emerging technologies to engineer cutting-edge solutions.",
        },
        quality: {
          title: "Craftsmanship",
          description: "Every line of code and every pixel receives our uncompromising attention to detail and pursuit of perfection.",
        },
        collaboration: {
          title: "Collaboration",
          description: "We partner closely with our clients, turning shared visions into tangible, high-performing realities.",
        },
        passion: {
          title: "Driven by Passion",
          description: "Our genuine love for digital creation is the core engine that powers our exceptional user experiences.",
        },
      },
    },
    brandName: "Digital Solution Workspace",
  },
  contact: {
    title: "Contact Us",
    subtitle: "Have a project in mind? Reach out to us through any of the channels below.",
    officeHours: "Office Hours",
    weekdays: "Monday - Friday",
    saturday: "Saturday",
    methods: [
      {
        title: "Email",
        value: "ds_studio@gmail.com",
        href: "mailto:ds_studio@gmail.com",
        desc: "We reply within 24 hours",
      },
      {
        title: "Facebook",
        value: "Digital Solution Studio",
        href: "https://www.facebook.com/share/1Aryrru3t1/?mibextid=wwXIfr",
        desc: "Follow us for updates",
      },
    ],
  },
};
