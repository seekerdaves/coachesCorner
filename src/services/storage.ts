import type { AppConfig, GeneratedPost, Resource, CoachProfile } from '../types';

const STORAGE_KEY = 'bowling-coach-app-data';

const DEFAULT_CONFIG: AppConfig = {
  profile: {
    name: 'Coach',
    schoolName: 'High School',
    teamName: 'Bowling Team',
  },
  resources: [
    {
      id: '1',
      title: 'USBC Bowling Fundamentals',
      url: 'https://bowl.com/welcome/bowling-fundamentals',
      category: 'Fundamentals',
      tags: ['basics', 'technique'],
      addedDate: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Etiquette and Lingo',
      url: 'https://bowl.com/welcome/etiquette-and-lingo',
      category: 'Etiquette',
      tags: ['rules', 'sportsmanship'],
      addedDate: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Basic Rules',
      url: 'https://bowl.com/welcome/basic-rules',
      category: 'Rules',
      tags: ['basics', 'rules'],
      addedDate: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Fundamental Coaching',
      url: 'https://bowl.com/coaching/fundamental/',
      category: 'Coaching',
      tags: ['coaching', 'beginner'],
      addedDate: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Intermediate Coaching',
      url: 'https://bowl.com/coaching/intermediate/',
      category: 'Coaching',
      tags: ['coaching', 'intermediate'],
      addedDate: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Advanced Coaching',
      url: 'https://bowl.com/coaching/advanced/',
      category: 'Coaching',
      tags: ['coaching', 'advanced'],
      addedDate: new Date().toISOString(),
    },
    {
      id: '7',
      title: 'Physical Fitness for Bowling',
      url: 'https://images.bowl.com/bowl/media/legacy/internap/bowl/coaching/pdfs/Physical_Fitness.pdf',
      category: 'Fitness',
      tags: ['fitness', 'training'],
      addedDate: new Date().toISOString(),
    },
  ],
  posts: [],
  postHistory: [],
};

export const loadConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new fields
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        resources: parsed.resources || DEFAULT_CONFIG.resources,
        posts: parsed.posts || [],
        postHistory: parsed.postHistory || [],
      };
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config:', error);
  }
};

export const updateProfile = (profile: CoachProfile): void => {
  const config = loadConfig();
  config.profile = profile;
  saveConfig(config);
};

export const addResource = (resource: Omit<Resource, 'id' | 'addedDate'>): Resource => {
  const config = loadConfig();
  const newResource: Resource = {
    ...resource,
    id: Date.now().toString(),
    addedDate: new Date().toISOString(),
  };
  config.resources.push(newResource);
  saveConfig(config);
  return newResource;
};

export const updateResource = (id: string, updates: Partial<Resource>): void => {
  const config = loadConfig();
  const index = config.resources.findIndex((r) => r.id === id);
  if (index !== -1) {
    config.resources[index] = { ...config.resources[index], ...updates };
    saveConfig(config);
  }
};

export const deleteResource = (id: string): void => {
  const config = loadConfig();
  config.resources = config.resources.filter((r) => r.id !== id);
  saveConfig(config);
};

export const addPost = (post: Omit<GeneratedPost, 'id' | 'generatedDate' | 'isUsed'>): GeneratedPost => {
  const config = loadConfig();
  const newPost: GeneratedPost = {
    ...post,
    id: Date.now().toString(),
    generatedDate: new Date().toISOString(),
    isUsed: false,
  };
  config.posts.unshift(newPost); // Add to beginning
  saveConfig(config);
  return newPost;
};

export const markPostAsUsed = (id: string): void => {
  const config = loadConfig();
  const post = config.posts.find((p) => p.id === id);
  if (post) {
    post.isUsed = true;
    post.usedDate = new Date().toISOString();
    if (!config.postHistory.includes(id)) {
      config.postHistory.push(id);
    }
    saveConfig(config);
  }
};

export const deletePost = (id: string): void => {
  const config = loadConfig();
  config.posts = config.posts.filter((p) => p.id !== id);
  config.postHistory = config.postHistory.filter((pid) => pid !== id);
  saveConfig(config);
};

export const getUnusedPosts = (): GeneratedPost[] => {
  const config = loadConfig();
  return config.posts.filter((p) => !p.isUsed);
};

export const getUsedPosts = (): GeneratedPost[] => {
  const config = loadConfig();
  return config.posts.filter((p) => p.isUsed);
};
