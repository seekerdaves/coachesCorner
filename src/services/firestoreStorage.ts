import {
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { AppConfig, GeneratedPost, Resource, CoachProfile } from '../types';

// Firestore collection names
const COLLECTIONS = {
  USERS: 'users',
};

// Helper to get user doc reference
const getUserDocRef = (userId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db, COLLECTIONS.USERS, userId);
};

// Save user profile
export const saveProfile = async (userId: string, profile: CoachProfile): Promise<void> => {
  const userRef = getUserDocRef(userId);
  await setDoc(userRef, { profile, updatedAt: Timestamp.now() }, { merge: true });
};

// Load user profile
export const loadProfile = async (userId: string): Promise<CoachProfile | null> => {
  const userRef = getUserDocRef(userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data().profile as CoachProfile) : null;
};

// Save user's Gemini API key (encrypted in their own Firebase doc)
export const saveApiKey = async (userId: string, apiKey: string): Promise<void> => {
  const userRef = getUserDocRef(userId);
  await setDoc(userRef, { geminiApiKey: apiKey, updatedAt: Timestamp.now() }, { merge: true });
};

// Load user's Gemini API key
export const loadApiKey = async (userId: string): Promise<string | null> => {
  const userRef = getUserDocRef(userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data().geminiApiKey as string) || null : null;
};

// Posts Management
export const savePosts = async (userId: string, posts: GeneratedPost[]): Promise<void> => {
  const userRef = getUserDocRef(userId);
  await setDoc(userRef, { posts, updatedAt: Timestamp.now() }, { merge: true });
};

export const loadPosts = async (userId: string): Promise<GeneratedPost[]> => {
  const userRef = getUserDocRef(userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data().posts as GeneratedPost[]) || [] : [];
};

// Resources Management
export const saveResources = async (userId: string, resources: Resource[]): Promise<void> => {
  const userRef = getUserDocRef(userId);
  await setDoc(userRef, { resources, updatedAt: Timestamp.now() }, { merge: true });
};

export const loadResources = async (userId: string): Promise<Resource[]> => {
  const userRef = getUserDocRef(userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? (userDoc.data().resources as Resource[]) || [] : [];
};

// Load entire config
export const loadConfigFromFirestore = async (userId: string): Promise<Partial<AppConfig>> => {
  const userRef = getUserDocRef(userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return {};
  }

  const data = userDoc.data();
  return {
    profile: data.profile,
    posts: data.posts || [],
    resources: data.resources || [],
    postHistory: data.postHistory || [],
  };
};

// Save entire config
export const saveConfigToFirestore = async (
  userId: string,
  config: Partial<AppConfig>
): Promise<void> => {
  const userRef = getUserDocRef(userId);
  await setDoc(
    userRef,
    {
      ...config,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};
