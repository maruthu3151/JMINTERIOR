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
import { ServiceItem } from '../types';
import { INITIAL_SERVICES } from '../utils/defaults';
import { deleteFileByUrl } from './storageService';

const COLLECTION_NAME = 'services';

export const getServices = async (onlyPublished = false): Promise<ServiceItem[]> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_services');
    const list: ServiceItem[] = local ? JSON.parse(local) : INITIAL_SERVICES.map((s, i) => ({ ...s, id: `svc-${i + 1}` }));
    return onlyPublished ? list.filter((s) => s.isPublished) : list;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q = query(colRef, orderBy('order', 'asc'));

    if (onlyPublished) {
      q = query(colRef, where('isPublished', '==', true), orderBy('order', 'asc'));
    }

    const snapshot = await getDocs(q);
    const items: ServiceItem[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as Omit<ServiceItem, 'id'>) });
    });

    if (items.length === 0 && !onlyPublished) {
      return INITIAL_SERVICES.map((s, i) => ({ ...s, id: `init-svc-${i + 1}` }));
    }

    return items;
  } catch (error) {
    console.error('Error fetching services from Firestore:', error);
    const fallback = INITIAL_SERVICES.map((s, i) => ({ ...s, id: `init-svc-${i + 1}` }));
    return onlyPublished ? fallback.filter((s) => s.isPublished) : fallback;
  }
};

export const createService = async (service: Omit<ServiceItem, 'id'>): Promise<string> => {
  if (!isFirebaseConfigured()) {
    const current = await getServices(false);
    const id = `local-svc-${Date.now()}`;
    const updated = [...current, { id, ...service }];
    localStorage.setItem('jm_local_preview_services', JSON.stringify(updated));
    return id;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, service);
  return docRef.id;
};

export const updateService = async (id: string, updates: Partial<ServiceItem>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getServices(false);
    const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
    localStorage.setItem('jm_local_preview_services', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
};

export const deleteService = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getServices(false);
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem('jm_local_preview_services', JSON.stringify(updated));
    return;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ServiceItem;
      if (data.imageUrl) await deleteFileByUrl(data.imageUrl);
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};
