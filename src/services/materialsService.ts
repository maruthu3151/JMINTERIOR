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
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { MaterialItem } from '../types';
import { INITIAL_MATERIALS } from '../utils/defaults';
import { deleteFileByUrl } from './storageService';

const COLLECTION_NAME = 'materials';

export const getMaterials = async (onlyPublished = false): Promise<MaterialItem[]> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_materials');
    const list: MaterialItem[] = local ? JSON.parse(local) : INITIAL_MATERIALS.map((m, i) => ({ ...m, id: `mat-${i + 1}` }));
    return onlyPublished ? list.filter((m) => m.isPublished) : list;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q = query(colRef);

    if (onlyPublished) {
      q = query(colRef, where('isPublished', '==', true));
    }

    const snapshot = await getDocs(q);
    const items: MaterialItem[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as Omit<MaterialItem, 'id'>) });
    });

    if (items.length === 0 && !onlyPublished) {
      return INITIAL_MATERIALS.map((m, i) => ({ ...m, id: `init-mat-${i + 1}` }));
    }

    return items;
  } catch (error) {
    console.error('Error fetching materials from Firestore:', error);
    const fallback = INITIAL_MATERIALS.map((m, i) => ({ ...m, id: `init-mat-${i + 1}` }));
    return onlyPublished ? fallback.filter((m) => m.isPublished) : fallback;
  }
};

export const createMaterial = async (material: Omit<MaterialItem, 'id'>): Promise<string> => {
  if (!isFirebaseConfigured()) {
    const current = await getMaterials(false);
    const id = `local-mat-${Date.now()}`;
    const updated = [...current, { id, ...material }];
    localStorage.setItem('jm_local_preview_materials', JSON.stringify(updated));
    return id;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, material);
  return docRef.id;
};

export const updateMaterial = async (id: string, updates: Partial<MaterialItem>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getMaterials(false);
    const updated = current.map((m) => (m.id === id ? { ...m, ...updates } : m));
    localStorage.setItem('jm_local_preview_materials', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
};

export const deleteMaterial = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getMaterials(false);
    const updated = current.filter((m) => m.id !== id);
    localStorage.setItem('jm_local_preview_materials', JSON.stringify(updated));
    return;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as MaterialItem;
      if (data.imageUrl) await deleteFileByUrl(data.imageUrl);
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};
