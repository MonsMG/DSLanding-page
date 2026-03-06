export const contentData = {
  // Global Navigation
  nav: {
    home: { en: "Home", th: "หน้าหลัก" },
    software: { en: "Software", th: "ซอฟต์แวร์" },
    production: { en: "Production", th: "โปรดักชั่น" },
    about: { en: "About", th: "เกี่ยวกับเรา" },
    contact: { en: "Contact", th: "ติดต่อเรา" },
  },
  // Home Page (Software)
  home: {
    hero: {
      title: "Designed to Solve.\nBuilt to Improve.",
      subtitle: {
        en: "Crafting innovative digital solutions that streamline workflows and enhance productivity.",
        th: "สร้างสรรค์นวัตกรรมดิจิทัลเพื่อแก้ปัญหา พัฒนากระบวนการทำงาน และเพิ่มประสิทธิภาพสู่ความสำเร็จ",
      },
      button: { en: "View Projects", th: "ดูผลงาน" },
      exploreSoftware: { en: "Explore Software", th: "สำรวจซอฟต์แวร์" },
      exploreProduction: { en: "Explore Production", th: "สำรวจโปรดักชั่น" },
      slogan: {
        en: "From Vision to Digital Solution",
        th: "จากวิสัยทัศน์สู่โซลูชันดิจิทัล",
      },
    },
    skillsTitle: { en: "Technical Skills", th: "ทักษะทางเทคนิค" },
    projectsTitle: { en: "Software Projects", th: "โปรเจกต์ซอฟต์แวร์" },
    archiveButton: { en: "View More Archive", th: "ดูผลงานทั้งหมด" },
  },
  // Software Projects Data
  projects: {
    "1": {
      id: "1",
      link: "https://check-it-ouch.lovable.app/",
      name: { en: "Check-in System", th: "ระบบเช็คชื่อ" },
      desc: {
        en: "A streamlined check-in system for tracking attendance and achievements.",
        th: "ระบบเช็คชื่อที่ทันสมัย สำหรับติดตามการเข้าเรียนและความสำเร็จแบบเรียลไทม์",
      },
      fullDesc: {
        en: "Our Check-in System is a comprehensive solution designed for organizations to track attendance and monitor participant achievements in real-time. Built with modern web technologies, it offers a seamless experience for both administrators and users. The system includes features like QR code scanning, automated reporting, and integration capabilities with existing HR systems.",
        th: "ระบบ Check-in System เป็นโซลูชันครบวงจรที่ออกแบบมาสำหรับองค์กรที่ต้องการติดตามการเข้าร่วมและตรวจสอบความสำเร็จของผู้เข้าร่วมแบบเรียลไทม์ สร้างด้วยเทคโนโลยีเว็บที่ทันสมัย มอบประสบการณ์ที่ราบรื่นสำหรับทั้งผู้ดูแลระบบและผู้ใช้งาน",
      },
      target: {
        en: [
          "Corporate HR departments",
          "Educational institutions",
          "Event organizers",
          "Conference managers",
          "Training facilities",
        ],
        th: [
          "ฝ่ายทรัพยากรบุคคล",
          "สถาบันการศึกษา",
          "ผู้จัดงานอีเวนต์",
          "ผู้จัดการประชุม",
          "สถานที่ฝึกอบรม",
        ],
      },
      features: {
        en: [
          "Real-time attendance tracking",
          "QR code check-in capability",
          "Automated achievement badges",
          "Comprehensive analytics dashboard",
          "Export reports in multiple formats",
        ],
        th: [
          "ติดตามการเข้าร่วมแบบเรียลไทม์",
          "เช็คอินด้วย QR Code",
          "ตราความสำเร็จอัตโนมัติ",
          "แดชบอร์ดวิเคราะห์ข้อมูล",
          "ส่งออกรายงานหลายรูปแบบ",
        ],
      },
    },
    "2": {
      id: "2",
      link: "https://ft-matcher.lovable.app/",
      name: { en: "Freetime Matcher", th: "ระบบจัดตารางเวลา" },
      desc: {
        en: "Intelligent scheduling tool for matching availability.",
        th: "เครื่องมือจัดตารางเวลาอัจฉริยะ สำหรับจับคู่เวลาว่าง",
      },
      fullDesc: {
        en: "Freetime Matcher revolutionizes the way teams coordinate their schedules. This intelligent scheduling tool analyzes team members' availability and automatically suggests optimal meeting times. Say goodbye to endless email chains trying to find a suitable slot - our algorithm does the heavy lifting, ensuring maximum participation while respecting individual preferences and time zones.",
        th: "Freetime Matcher ปฏิวัติการนัดหมายทีมด้วยการวิเคราะห์เวลาว่างและแนะนำเวลาประชุมที่เหมาะสมที่สุดโดยอัตโนมัติ บอกลาการส่งอีเมลไปมาเพื่อหาเวลาที่เหมาะสม อัลกอริทึมของเราจะจัดการให้ทุกอย่าง",
      },
      target: {
        en: [
          "Remote and hybrid teams",
          "Project managers",
          "HR coordinators",
          "Academic advisors",
          "Freelancers and consultants",
        ],
        th: [
          "ทีมทำงานระยะไกล",
          "ผู้จัดการโครงการ",
          "ผู้ประสานงาน HR",
          "ที่ปรึกษาวิชาการ",
          "ฟรีแลนซ์และที่ปรึกษา",
        ],
      },
      features: {
        en: [
          "Smart availability matching algorithm",
          "Multi-timezone support",
          "Calendar integration (Google, Outlook)",
          "Recurring meeting optimization",
          "Team preference learning",
        ],
        th: [
          "อัลกอริทึมจับคู่เวลาอัจฉริยะ",
          "รองรับหลายเขตเวลา",
          "เชื่อมต่อปฏิทิน (Google, Outlook)",
          "ปรับปรุงการประชุมซ้ำ",
          "เรียนรู้ความชอบของทีม",
        ],
      },
    },
    "3": {
      id: "3",
      link: "https://tagcast-connect.lovable.app",
      name: { en: "Messaging Hub", th: "ศูนย์กลางสื่อสาร" },
      desc: {
        en: "Unified communication platform for team messaging.",
        th: "แพลตฟอร์มสื่อสารรวมศูนย์ เพื่อการส่งข้อความทีม",
      },
      fullDesc: {
        en: "Messaging Hub serves as your organization's central communication nerve center. This unified platform enables seamless team messaging, broadcast announcements, and targeted communication channels. With features like scheduled messages, read receipts, and department-specific channels, keeping your team informed has never been easier or more efficient.",
        th: "Messaging Hub คือศูนย์กลางการสื่อสารขององค์กร แพลตฟอร์มรวมศูนย์นี้ช่วยให้การส่งข้อความทีมและประกาศข่าวสารเป็นเรื่องง่าย พร้อมฟีเจอร์ตั้งเวลาส่ง, ตรวจสอบการอ่าน และช่องทางเฉพาะแผนก",
      },
      target: {
        en: [
          "Medium to large enterprises",
          "Educational institutions",
          "Non-profit organizations",
          "Government agencies",
          "Multi-location businesses",
        ],
        th: [
          "องค์กรขนาดกลางถึงใหญ่",
          "สถาบันการศึกษา",
          "องค์กรไม่แสวงหากำไร",
          "หน่วยงานราชการ",
          "ธุรกิจหลายสาขา",
        ],
      },
      features: {
        en: [
          "Broadcast messaging to groups",
          "Scheduled message delivery",
          "Read receipt tracking",
          "Department-specific channels",
          "Priority message flagging",
        ],
        th: [
          "ส่งข้อความบรอดแคสต์",
          "ตั้งเวลาส่งข้อความ",
          "ติดตามการอ่านข้อความ",
          "ช่องทางเฉพาะแผนก",
          "กำหนดข้อความสำคัญ",
        ],
      },
    },
  },
  // Archive Page
  archive: {
    title: { en: "Software Projects Archive", th: "คลังผลงานซอฟต์แวร์ทั้งหมด" },
    subtitle: {
      en: "A complete collection of digital solutions and experiments.",
      th: "รวบรวมโซลูชันดิจิทัลและการทดลองทั้งหมดของเรา",
    },
    backButton: { en: "Back to Home", th: "กลับหน้าหลัก" },
    noResults: {
      en: "No projects found matching your criteria.",
      th: "ไม่พบโปรเจกต์ที่ตรงกับเกณฑ์ของคุณ",
    },
    allCategory: { en: "All", th: "ทั้งหมด" },
  },
  // Gear Archive Page
  gearArchive: {
    title: {
      en: "Production Gear Archive",
      th: "คลังอุปกรณ์โปรดักชั่นทั้งหมด",
    },
    subtitle: {
      en: "A complete collection of our professional production equipment.",
      th: "รวบรวมอุปกรณ์โปรดักชั่นมืออาชีพทั้งหมดของเรา",
    },
    noResults: {
      en: "No gear found matching your criteria.",
      th: "ไม่พบอุปกรณ์ที่ตรงกับเกณฑ์ของคุณ",
    },
    allCategory: { en: "All", th: "ทั้งหมด" },
  },
  // IT Project Detail Page
  projectDetail: {
    backToProjects: { en: "Back to Projects", th: "กลับไปหน้าโปรเจกต์" },
    visitWebsite: { en: "Visit Website", th: "เยี่ยมชมเว็บไซต์" },
    aboutProject: { en: "About This Project", th: "เกี่ยวกับโปรเจกต์นี้" },
    forWhom: { en: "Who This Is For", th: "เหมาะสำหรับใคร" },
    keyFeatures: { en: "Key Features", th: "ฟีเจอร์หลัก" },
    projectNotFound: { en: "Project Not Found", th: "ไม่พบโปรเจกต์" },
    backToIT: { en: "Back to IT Projects", th: "กลับไปหน้าโปรเจกต์ IT" },
  },
  // Production Page
  production: {
    heroTitle: "DS Production",
    heroSubtitle: {
      en: "Professional production services for your creative vision",
      th: "บริการโปรดักชั่นมืออาชีพสำหรับวิสัยทัศน์สร้างสรรค์ของคุณ",
    },
    slogan: {
      en: "We are DS Studio, Not just a simple studio.",
      th: "เราคือ DS Studio ไม่ใช่แค่สตูดิโอธรรมดา",
    },
    sections: {
      work: { en: "OUR WORK", th: "ผลงานของเรา" },
      workSubtitle: { en: "Portfolio", th: "ผลงาน" },
      create: { en: "WE CREATE", th: "สิ่งที่เราสร้างสรรค์" },
      createSubtitle: { en: "What We Do", th: "สิ่งที่เราทำ" },
      behind: { en: "BEHIND THE SCENE", th: "เบื้องหลังการทำงาน" },
      behindSubtitle: { en: "Life at DS", th: "ชีวิตที่ DS" },
      gear: { en: "Our Production Gear", th: "อุปกรณ์โปรดักชั่นของเรา" },
      gearSubtitle: { en: "Equipment", th: "อุปกรณ์" },
    },
    moreDetails: { en: "More Details", th: "รายละเอียดเพิ่มเติม" },
    viewAllGear: { en: "View All Gear", th: "ดูอุปกรณ์ทั้งหมด" },
    services: {
      video: {
        label: { en: "Video Production", th: "ผลิตวิดีโอ" },
        description: {
          en: "Professional video content from concept to final cut",
          th: "เนื้อหาวิดีโอมืออาชีพตั้งแต่แนวคิดจนถึงการตัดต่อ",
        },
      },
      photography: {
        label: { en: "Photography", th: "ถ่ายภาพ" },
        description: {
          en: "Stunning visuals that capture your brand essence",
          th: "ภาพสวยงามที่จับแก่นแท้ของแบรนด์คุณ",
        },
      },
      editing: {
        label: { en: "Editing", th: "ตัดต่อ" },
        description: {
          en: "Expert post-production and color grading",
          th: "โพสต์โปรดักชั่นและเกรดสีอย่างเชี่ยวชาญ",
        },
      },
    },
    workItems: {
      event1: {
        placeholder: { en: "Corporate Event", th: "งานองค์กร" },
        category: { en: "Events", th: "อีเวนต์" },
      },
      video1: {
        placeholder: { en: "Tutorial Series", th: "ซีรีส์สอน" },
        category: { en: "Tutorial Clips", th: "คลิปสอน" },
      },
      image1: {
        placeholder: { en: "Product Showcase", th: "โชว์เคสสินค้า" },
        category: { en: "Still Images", th: "ภาพนิ่ง" },
      },
      event2: {
        placeholder: { en: "Wedding Coverage", th: "งานแต่งงาน" },
        category: { en: "Events", th: "อีเวนต์" },
      },
      video2: {
        placeholder: { en: "How-To Guide", th: "คู่มือวิธีการ" },
        category: { en: "Tutorial Clips", th: "คลิปสอน" },
      },
      image2: {
        placeholder: { en: "Portrait Session", th: "ถ่ายภาพบุคคล" },
        category: { en: "Still Images", th: "ภาพนิ่ง" },
      },
    },
    behindScenes: {
      onSet: {
        placeholder: { en: "On Set", th: "ในกองถ่าย" },
        description: { en: "Capturing the magic", th: "จับช่วงเวลาวิเศษ" },
        image_url:
          "https://scontent.fcnx1-1.fna.fbcdn.net/v/t39.30808-6/628030926_122137042910987911_9134088275520610199_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=13d280&_nc_ohc=A33vdZieuaMQ7kNvwFgfE5X&_nc_oc=AdmRojRDAcI811siW0r-EGbnf6v6D0XFQndM_xr0nj6cVNh7G7Taiw7vrRRoMmfUhwg&_nc_zt=23&_nc_ht=scontent.fcnx1-1.fna&_nc_gid=kVG6UYtRL4GhVxdGiDHm0w&oh=00_AfvL3nUeJdP5_v88j3qpy-HsxrflQnqvx6pMV5qntgv1Vg&oe=69A6E850",
      },
      teamMeeting: {
        placeholder: { en: "Team Meeting", th: "ประชุมทีม" },
        description: {
          en: "Creative brainstorming",
          th: "ระดมความคิดสร้างสรรค์",
        },
        image_url: "",
      },
      equipmentSetup: {
        placeholder: { en: "Equipment Setup", th: "ติดตั้งอุปกรณ์" },
        description: { en: "Preparation phase", th: "ขั้นตอนเตรียมการ" },
        image_url: "",
      },
      postProduction: {
        placeholder: { en: "Post-Production", th: "โพสต์โปรดักชั่น" },
        description: { en: "Final touches", th: "ตกแต่งขั้นสุดท้าย" },
        image_url: "",
      },
      locationScout: {
        placeholder: { en: "Location Scout", th: "หาสถานที่" },
        description: {
          en: "Finding the perfect spot",
          th: "ค้นหาสถานที่ที่เหมาะสม",
        },
        image_url: "",
      },
      clientReview: {
        placeholder: { en: "Client Review", th: "ลูกค้าตรวจสอบ" },
        description: { en: "Collaboration time", th: "เวลาร่วมมือกัน" },
        image_url: "",
      },
    },
  },
  // About Page
  about: {
    title: { en: "About DS Workspace", th: "เกี่ยวกับ DS Workspace" },
    description: {
      en: "We are a creative digital studio dedicated to transforming ideas into exceptional digital experiences. Our passion drives innovation, and our expertise delivers results that exceed expectations.",
      th: "เราเป็นสตูดิโอดิจิทัลสร้างสรรค์ที่อุทิศตนเพื่อเปลี่ยนไอเดียให้เป็นประสบการณ์ดิจิทัลที่ยอดเยี่ยม ความหลงใหลของเราขับเคลื่อนนวัตกรรม และความเชี่ยวชาญของเรามอบผลลัพธ์ที่เกินความคาดหมาย",
    },
    stats: {
      projects: {
        value: "50+",
        label: { en: "Projects Completed", th: "โปรเจกต์สำเร็จ" },
      },
      clients: {
        value: "30+",
        label: { en: "Happy Clients", th: "ลูกค้าพึงพอใจ" },
      },
      experience: {
        value: "5+",
        label: { en: "Years Experience", th: "ปีประสบการณ์" },
      },
      team: { value: "10+", label: { en: "Team Members", th: "สมาชิกในทีม" } },
    },
    mission: {
      subtitle: { en: "Our Mission", th: "พันธกิจของเรา" },
      title: {
        en: "Empowering Digital Excellence",
        th: "ส่งเสริมความเป็นเลิศทางดิจิทัล",
      },
      description: {
        en: "To empower businesses and individuals with innovative digital solutions that not only meet their needs but exceed their expectations. We believe in the power of technology to transform, connect, and inspire people around the world.",
        th: "เพื่อเสริมศักยภาพธุรกิจและบุคคลด้วยโซลูชันดิจิทัลที่สร้างสรรค์ ไม่เพียงแค่ตอบสนองความต้องการแต่ยังเกินความคาดหมาย เราเชื่อในพลังของเทคโนโลยีที่จะเปลี่ยนแปลง เชื่อมต่อ และสร้างแรงบันดาลใจให้ผู้คนทั่วโลก",
      },
    },
    values: {
      subtitle: { en: "What We Stand For", th: "สิ่งที่เรายึดมั่น" },
      title: { en: "Our Values", th: "ค่านิยมของเรา" },
      items: {
        innovation: {
          title: { en: "Innovation", th: "นวัตกรรม" },
          description: {
            en: "We push boundaries and embrace new technologies to deliver cutting-edge solutions.",
            th: "เราผลักดันขอบเขตและยอมรับเทคโนโลยีใหม่เพื่อมอบโซลูชันล้ำสมัย",
          },
        },
        quality: {
          title: { en: "Quality", th: "คุณภาพ" },
          description: {
            en: "Every project receives our full attention to detail and commitment to excellence.",
            th: "ทุกโปรเจกต์ได้รับความใส่ใจในรายละเอียดและความมุ่งมั่นสู่ความเป็นเลิศ",
          },
        },
        collaboration: {
          title: { en: "Collaboration", th: "ความร่วมมือ" },
          description: {
            en: "We work closely with our clients to understand their vision and bring it to life.",
            th: "เราทำงานอย่างใกล้ชิดกับลูกค้าเพื่อเข้าใจวิสัยทัศน์และทำให้เป็นจริง",
          },
        },
        passion: {
          title: { en: "Passion", th: "ความหลงใหล" },
          description: {
            en: "Our love for what we do drives us to create exceptional digital experiences.",
            th: "ความรักในสิ่งที่เราทำขับเคลื่อนให้เราสร้างประสบการณ์ดิจิทัลที่ยอดเยี่ยม",
          },
        },
      },
    },
    brandName: {
      en: "Digital Solution Workspace",
      th: "พื้นที่ทำงานโซลูชันดิจิทัล",
    },
  },
  // Contact Page
  contact: {
    title: { en: "Contact Us", th: "ติดต่อเรา" },
    subtitle: {
      en: "Have a project in mind? Reach out to us through any of the channels below.",
      th: "มีโปรเจกต์ในใจ? ติดต่อเราผ่านช่องทางด้านล่าง",
    },
    officeHours: { en: "Office Hours", th: "เวลาทำการ" },
    weekdays: { en: "Monday - Friday", th: "จันทร์ - ศุกร์" },
    saturday: { en: "Saturday", th: "เสาร์" },
    methods: [
      {
        title: "Email",
        value: "ds_studio@gmail.com",
        href: "mailto:ds_studio@gmail.com",
        desc: { en: "We reply within 24 hours", th: "ตอบกลับภายใน 24 ชม." },
      },
      {
        title: "Facebook",
        value: "Digital Solution Studio",
        href: "https://www.facebook.com/share/1Aryrru3t1/?mibextid=wwXIfr",
        desc: { en: "Follow us for updates", th: "ติดตามข่าวสารอัปเดต" },
      },
    ],
  },
};
