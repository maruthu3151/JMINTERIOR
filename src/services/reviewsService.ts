import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { ReviewItem } from '../types';
import { INITIAL_REVIEWS } from '../utils/defaults';

const COLLECTION_NAME = 'reviews';

export const getReviews = async (onlyPublished = false): Promise<ReviewItem[]> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_reviews');
    const list: ReviewItem[] = local ? JSON.parse(local) : INITIAL_REVIEWS.map((r, i) => ({ ...r, id: `rev-${i + 1}` }));
    return onlyPublished ? list.filter((r) => r.isPublished) : list;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q = query(colRef, orderBy('createdAt', 'desc'));

    if (onlyPublished) {
      q = query(colRef, where('isPublished', '==', true), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    const items: ReviewItem[] = [];
    snapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as Omit<ReviewItem, 'id'>) });
    });

    if (items.length === 0 && !onlyPublished) {
      return INITIAL_REVIEWS.map((r, i) => ({ ...r, id: `init-rev-${i + 1}` }));
    }

    return items;
  } catch (error) {
    console.error('Error fetching reviews from Firestore:', error);
    const fallback = INITIAL_REVIEWS.map((r, i) => ({ ...r, id: `init-rev-${i + 1}` }));
    return onlyPublished ? fallback.filter((r) => r.isPublished) : fallback;
  }
};

export const createReview = async (review: Omit<ReviewItem, 'id' | 'createdAt'>): Promise<string> => {
  const newReview = {
    ...review,
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured()) {
    const current = await getReviews(false);
    const id = `local-rev-${Date.now()}`;
    const updated = [ { id, ...newReview }, ...current ];
    localStorage.setItem('jm_local_preview_reviews', JSON.stringify(updated));
    return id;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, newReview);
  return docRef.id;
};

export const updateReview = async (id: string, updates: Partial<ReviewItem>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getReviews(false);
    const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
    localStorage.setItem('jm_local_preview_reviews', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
};

export const deleteReview = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const current = await getReviews(false);
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem('jm_local_preview_reviews', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
