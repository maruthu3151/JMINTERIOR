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
import { Appointment } from '../types';

const COLLECTION_NAME = 'appointments';

export const createAppointment = async (
  apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>
): Promise<string> => {
  const newAppointment = {
    ...apt,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_appointments');
    const list: Appointment[] = local ? JSON.parse(local) : [];
    const id = `local-apt-${Date.now()}`;
    list.unshift({ id, ...newAppointment });
    localStorage.setItem('jm_local_preview_appointments', JSON.stringify(list));
    return id;
  }

  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, newAppointment);
  return docRef.id;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_appointments');
    return local ? JSON.parse(local) : [];
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const list: Appointment[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Appointment, 'id'>) });
    });
    return list;
  } catch (error) {
    console.error('Error fetching appointments from Firestore:', error);
    return [];
  }
};

export const updateAppointmentStatus = async (
  id: string,
  status: Appointment['status'],
  adminNotes?: string
): Promise<void> => {
  const updates: Partial<Appointment> = { status };
  if (adminNotes !== undefined) {
    updates.adminNotes = adminNotes;
  }

  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_appointments');
    const list: Appointment[] = local ? JSON.parse(local) : [];
    const updated = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
    localStorage.setItem('jm_local_preview_appointments', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
};

export const deleteAppointment = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_appointments');
    const list: Appointment[] = local ? JSON.parse(local) : [];
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem('jm_local_preview_appointments', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
