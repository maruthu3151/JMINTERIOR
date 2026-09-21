import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { ContactMessage } from '../types';

const COLLECTION_NAME = 'messages';

export const createMessage = async (
  msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<string> => {
  const newMessage = {
    ...msg,
    status: 'unread' as const,
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_messages');
    const list: ContactMessage[] = local ? JSON.parse(local) : [];
    const id = `local-msg-${Date.now()}`;
    list.unshift({ id, ...newMessage });
    localStorage.setItem('jm_local_preview_messages', JSON.stringify(list));
    return id;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, newMessage);
  return docRef.id;
};

export const getMessages = async (): Promise<ContactMessage[]> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_messages');
    return local ? JSON.parse(local) : [];
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const list: ContactMessage[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) });
    });
    return list;
  } catch (error) {
    console.error('Error fetching messages from Firestore:', error);
    return [];
  }
};

export const updateMessageStatus = async (
  id: string,
  status: ContactMessage['status']
): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_messages');
    const list: ContactMessage[] = local ? JSON.parse(local) : [];
    const updated = list.map((m) => (m.id === id ? { ...m, status } : m));
    localStorage.setItem('jm_local_preview_messages', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
};

export const deleteMessage = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_messages');
    const list: ContactMessage[] = local ? JSON.parse(local) : [];
    const updated = list.filter((m) => m.id !== id);
    localStorage.setItem('jm_local_preview_messages', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
