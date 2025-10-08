// Type definitions for the Bowling Coach App

export type PostType =
  | 'Tip of the Day'
  | 'Motivational'
  | 'Technique Deep Dive'
  | 'Team Achievement'
  | 'Practice Drill'
  | 'Mental Game'
  | 'Equipment Advice'
  | 'Event Announcement'
  | 'Season Reflection';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type CoachPersonaType =
  | 'Old School League Bowler'
  | 'Competitive Grinder'
  | 'Next Gen Hotshot'
  | 'Team Parent Coach'
  | 'Recreational Social'
  | 'Tech Data Enthusiast'
  | 'USBC Gold Coach'
  | 'Ball Driller Expert'
  | 'Positive Parent Coach'
  | 'Reddit Community';

export type PlatformFormat = 'standard' | 'facebook' | 'instagram' | 'twitter' | 'reddit';

export type RegenerateStyle = 'shorter' | 'nicer' | 'hipper' | 'change-personality' | 'facebook' | 'instagram' | 'twitter' | 'reddit';

export interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  addedDate: string;
}

export interface GeneratedPost {
  id: string;
  content: string;
  postType: PostType;
  skillLevel: SkillLevel;
  topic: string;
  category: string;
  generatedDate: string;
  isUsed: boolean;
  usedDate?: string;
  tags: string[];
}

export interface CoachProfile {
  name: string;
  schoolName: string;
  teamName: string;
  email?: string;
  socialHandle?: string;
}

export interface PersonaPreferences {
  defaultPersona: CoachPersonaType;
  enabledPersonas: CoachPersonaType[];
  defaultPlatformFormat: PlatformFormat;
}

export interface AppConfig {
  profile: CoachProfile;
  resources: Resource[];
  posts: GeneratedPost[];
  postHistory: string[]; // IDs of used posts
  personaPreferences?: PersonaPreferences;
}
