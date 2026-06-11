// src/i18n/types.ts

export interface Dictionary {
  nav: {
    home: string;
    software: string;
    production: string;
    about: string;
    contact: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      button: string;
      exploreSoftware: string;
      exploreProduction: string;
      slogan: string;
    };
    skillsTitle: string;
    projectsTitle: string;
    archiveButton: string;
  };
  projects: {
    [key: string]: {
      id: string;
      link: string;
      name: string;
      desc: string;
      fullDesc: string;
      target: string[];
      features: string[];
    };
  };
  archive: {
    title: string;
    subtitle: string;
    backButton: string;
    noResults: string;
    allCategory: string;
  };
  gearArchive: {
    title: string;
    subtitle: string;
    noResults: string;
    allCategory: string;
  };
  projectDetail: {
    backToProjects: string;
    visitWebsite: string;
    aboutProject: string;
    forWhom: string;
    keyFeatures: string;
    projectNotFound: string;
    backToIT: string;
  };
  production: {
    heroTitle: string;
    heroSubtitle: string;
    slogan: string;
    sections: {
      work: string;
      workSubtitle: string;
      create: string;
      createSubtitle: string;
      behind: string;
      behindSubtitle: string;
      gear: string;
      gearSubtitle: string;
    };
    moreDetails: string;
    viewAllGear: string;
    services: {
      video: {
        label: string;
        description: string;
      };
      photography: {
        label: string;
        description: string;
      };
      editing: {
        label: string;
        description: string;
      };
    };
    workItems: {
      [key: string]: {
        placeholder: string;
        category: string;
      };
    };
    behindScenes: {
      [key: string]: {
        placeholder: string;
        description: string;
        image_url: string;
      };
    };
  };
  about: {
    title: string;
    description: string;
    stats: {
      projects: {
        value: string;
        label: string;
      };
      clients: {
        value: string;
        label: string;
      };
      experience: {
        value: string;
        label: string;
      };
      team: {
        value: string;
        label: string;
      };
    };
    mission: {
      subtitle: string;
      title: string;
      description: string;
    };
    values: {
      subtitle: string;
      title: string;
      items: {
        innovation: {
          title: string;
          description: string;
        };
        quality: {
          title: string;
          description: string;
        };
        collaboration: {
          title: string;
          description: string;
        };
        passion: {
          title: string;
          description: string;
        };
      };
    };
    brandName: string;
  };
  contact: {
    title: string;
    subtitle: string;
    officeHours: string;
    weekdays: string;
    saturday: string;
    methods: {
      title: string;
      value: string;
      href: string;
      desc: string;
    }[];
  };
}
