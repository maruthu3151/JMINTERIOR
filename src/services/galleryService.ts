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
import { GalleryItem } from '../types';
import { INITIAL_GALLERY } from '../utils/defaults';
import { deleteFileByUrl } from './storageService';

const COLLECTION_NAME = 'gallery';

export const getGalleryItems = async (onlyPublished = false): Promise<GalleryItem[]> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_gallery');
    const list: GalleryItem[] = local ? JSON.parse(local) : INITIAL_GALLERY.map((g, i) => ({ ...g, id: `gal-${i + 1}` }));
    return onlyPublished ? list.filter((g) => g.isPublished) : list;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q = query(colRef, orderBy('createdAt', 'desc'));

    if (onlyPublished) {
      q = query(colRef, where('isPublished', '==', true), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    const items: GalleryItem[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) });
    });

    if (items.length === 0 && !onlyPublished) {
      return INITIAL_GALLERY.map((g, i) => ({ ...g, id: `init-gal-${i + 1}` }));
    }

    return items;
  } catch (error) {
    console.error('Error fetching gallery items from Firestore:', error);
    const fallback = INITIAL_GALLERY.map((g, i) => ({ ...g, id: `init-gal-${i + 1}` }));
    return onlyPublished ? fallback.filter((g) => g.isPublished) : fallback;
  }
};

export const createGalleryItem = async (
  item: Omit<GalleryItem, 'id' | 'createdAt'>
): Promise<string> => {
  const newItem = {
    ...item,
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured()) {
    const current = await getGalleryItems(false);
    const id = `local-gal-${Date.now()}`;
    const updated = [{ id, ...newItem }, ...current];
    localStorage.setItem('jm_local_preview_gallery', JSON.stringify(updated));
    return id;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, newItem);
  return docRef.id;
};

export const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getGalleryItems(false);
    const updated = current.map((g) => (g.id === id ? { ...g, ...updates } : g));
    localStorage.setItem('jm_local_preview_gallery', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getGalleryItems(false);
    const updated = current.filter((g) => g.id !== id);
    localStorage.setItem('jm_local_preview_gallery', JSON.stringify(updated));
    return;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as GalleryItem;
      if (data.imageUrl) await deleteFileByUrl(data.imageUrl);
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
};
