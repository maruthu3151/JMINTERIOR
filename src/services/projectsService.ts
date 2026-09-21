import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Project } from '../types';
import { INITIAL_PROJECTS } from '../utils/defaults';
import { deleteFileByUrl } from './storageService';

const COLLECTION_NAME = 'projects';

const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getProjects = async (onlyPublished = false): Promise<Project[]> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_projects');
    const list: Project[] = local ? JSON.parse(local) : INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `proj-${i + 1}` }));
    return onlyPublished ? list.filter((p) => p.isPublished) : list;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q = query(colRef, orderBy('createdAt', 'desc'));
    
    if (onlyPublished) {
      q = query(colRef, where('isPublished', '==', true), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    const projects: Project[] = [];
    snapshot.forEach((d) => {
      projects.push({ id: d.id, ...(d.data() as Omit<Project, 'id'>) });
    });

    // If Firestore is completely empty initially, fall back to initial project catalog
    if (projects.length === 0 && !onlyPublished) {
      return INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `init-proj-${i + 1}` }));
    }

    return projects;
  } catch (error) {
    console.error('Error fetching projects from Firestore:', error);
    const fallback = INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `init-proj-${i + 1}` }));
    return onlyPublished ? fallback.filter((p) => p.isPublished) : fallback;
  }
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  if (!isFirebaseConfigured()) {
    const projects = await getProjects(false);
    return projects.find((p) => p.slug === slug || p.id === slug) || null;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...(docSnap.data() as Omit<Project, 'id'>) };
    }

    // Try finding by doc ID as fallback
    const singleDocRef = doc(db, COLLECTION_NAME, slug);
    const singleSnap = await getDoc(singleDocRef);
    if (singleSnap.exists()) {
      return { id: singleSnap.id, ...(singleSnap.data() as Omit<Project, 'id'>) };
    }

    // Check defaults
    const defaults = INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `init-proj-${i + 1}` }));
    return defaults.find((p) => p.slug === slug || p.id === slug) || null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
};

export const createProject = async (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string }
): Promise<string> => {
  const now = new Date().toISOString();
  const slug = project.slug?.trim() || createSlug(project.title);

  const newProjectData = {
    ...project,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  if (!isFirebaseConfigured()) {
    const current = await getProjects(false);
    const id = `local-proj-${Date.now()}`;
    const updated = [{ id, ...newProjectData }, ...current];
    localStorage.setItem('jm_local_preview_projects', JSON.stringify(updated));
    return id;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, newProjectData);
  return docRef.id;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.title && !updates.slug) {
    updatedData.slug = createSlug(updates.title);
  }

  if (!isFirebaseConfigured()) {
    const current = await getProjects(false);
    const updated = current.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    localStorage.setItem('jm_local_preview_projects', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updatedData);
};

export const deleteProject = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getProjects(false);
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem('jm_local_preview_projects', JSON.stringify(updated));
    return;
  }

  // Retrieve project first to clean up its images from storage if needed
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Project;
      if (data.coverImage) await deleteFileByUrl(data.coverImage);
      if (data.beforeImage) await deleteFileByUrl(data.beforeImage);
      if (data.afterImage) await deleteFileByUrl(data.afterImage);
      if (data.galleryImages) {
        for (const imgUrl of data.galleryImages) {
          await deleteFileByUrl(imgUrl);
        }
      }
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
