 export const contentData = {
   // Global Navigation
   nav: {
     home: { en: "Home", th: "หน้าหลัก" },
     software: { en: "Software", th: "ซอฟต์แวร์" },
     production: { en: "Production", th: "โปรดักชั่น" },
     about: { en: "About", th: "เกี่ยวกับเรา" },
     contact: { en: "Contact", th: "ติดต่อเรา" }
   },
   // Home Page (Software)
   home: {
     hero: {
       title: "Designed to Solve.\nBuilt to Improve.",
       subtitle: { en: "Crafting innovative digital solutions that streamline workflows and enhance productivity.", th: "สร้างสรรค์นวัตกรรมดิจิทัลเพื่อแก้ปัญหา พัฒนากระบวนการทำงาน และเพิ่มประสิทธิภาพสู่ความสำเร็จ" },
       button: { en: "View Projects", th: "ดูผลงาน" }
     },
     skillsTitle: { en: "Technical Skills", th: "ทักษะทางเทคนิค" },
     projectsTitle: { en: "Software Projects", th: "โปรเจกต์ซอฟต์แวร์" },
     archiveButton: { en: "View More Archive", th: "ดูผลงานทั้งหมด" }
   },
   // Software Projects Data
   projects: {
     "1": {
       id: "1",
       link: "https://check-it-ouch.lovable.app/",
       name: { en: "Check-in System", th: "ระบบเช็คชื่อ" },
       desc: { en: "A streamlined check-in system for tracking attendance and achievements.", th: "ระบบเช็คชื่อที่ทันสมัย สำหรับติดตามการเข้าเรียนและความสำเร็จแบบเรียลไทม์" },
       fullDesc: { en: "Our Check-in System is a comprehensive solution designed for organizations to track attendance and monitor participant achievements in real-time.", th: "ระบบ Check-in System เป็นโซลูชันครบวงจรที่ออกแบบมาสำหรับองค์กรที่ต้องการติดตามการเข้าร่วมและตรวจสอบความสำเร็จของผู้เข้าร่วมแบบเรียลไทม์" },
       target: { en: ["HR", "Schools", "Events"], th: ["ฝ่ายบุคคล", "โรงเรียน", "อีเวนต์"] },
       features: { en: ["Real-time tracking", "QR code"], th: ["ติดตามเรียลไทม์", "สแกน QR"] }
     },
     "2": {
       id: "2",
       link: "https://ft-matcher.lovable.app/",
       name: { en: "Freetime Matcher", th: "ระบบจัดตารางเวลา" },
       desc: { en: "Intelligent scheduling tool for matching availability.", th: "เครื่องมือจัดตารางเวลาอัจฉริยะ สำหรับจับคู่เวลาว่าง" },
       fullDesc: { en: "Freetime Matcher revolutionizes team coordination by analyzing availability and suggesting optimal meeting times automatically.", th: "Freetime Matcher ปฏิวัติการนัดหมายทีมด้วยการวิเคราะห์เวลาว่างและแนะนำเวลาประชุมที่เหมาะสมที่สุดโดยอัตโนมัติ" },
       target: { en: ["Teams", "Managers"], th: ["ทีมงาน", "ผู้จัดการ"] },
       features: { en: ["Smart matching", "Calendar sync"], th: ["จับคู่เวลาอัจฉริยะ", "เชื่อมต่อปฏิทิน"] }
     },
     "3": {
       id: "3",
       link: "https://tagcast-connect.lovable.app",
       name: { en: "Messaging Hub", th: "ศูนย์กลางสื่อสาร" },
       desc: { en: "Unified communication platform for team messaging.", th: "แพลตฟอร์มสื่อสารรวมศูนย์ เพื่อการส่งข้อความทีม" },
       fullDesc: { en: "Messaging Hub is the central nerve center for team messaging, broadcast announcements, and targeted communication channels.", th: "Messaging Hub คือศูนย์กลางการสื่อสารขององค์กร ช่วยให้การส่งข้อความทีมและประกาศข่าวสารเป็นเรื่องง่าย" },
       target: { en: ["Enterprises", "Schools"], th: ["องค์กรขนาดใหญ่", "โรงเรียน"] },
       features: { en: ["Broadcast", "Scheduled delivery"], th: ["ส่งข้อความบรอดแคสต์", "ตั้งเวลาส่ง"] }
     }
   },
   // Production Page
   production: {
     heroTitle: "DS Studio",
     slogan: { en: "We are DS Studio, Not just a simple studio.", th: "เราคือ DS Studio ไม่ใช่แค่สตูดิโอธรรมดา" },
     sections: {
       work: { en: "OUR WORK", th: "ผลงานของเรา" },
       create: { en: "WE CREATE", th: "สิ่งที่เราสร้างสรรค์" },
       behind: { en: "BEHIND THE SCENE", th: "เบื้องหลังการทำงาน" },
       gear: { en: "Our Production Gear", th: "อุปกรณ์ของเรา" }
     }
   },
   // Contact Page
   contact: {
     title: { en: "Get in Touch", th: "ติดต่อเรา" },
     methods: [
       { 
         title: "Email", 
         value: "ds_studio@gmail.com", 
         href: "mailto:ds_studio@gmail.com",
         desc: { en: "We reply within 24 hours", th: "ตอบกลับภายใน 24 ชม." }
       },
       { 
         title: "Facebook", 
         value: "Digital Solution Studio", 
         href: "https://www.facebook.com/share/1Aryrru3t1/?mibextid=wwXIfr",
         desc: { en: "Follow us for updates", th: "ติดตามข่าวสารอัปเดต" }
       }
     ]
   }
 };