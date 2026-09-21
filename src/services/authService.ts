import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword as fbUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { AdminProfile } from '../types';

const ADMIN_PROFILE_PATH = 'users';
const ADMIN_PROFILE_DOC = 'admin_profile';
export const DEFAULT_ADMIN_USERNAME = 'SELVAM';

/**
 * Resolves a username (e.g., 'SELVAM') to its registered Firebase email.
 */
export const getAdminProfile = async (): Promise<AdminProfile> => {
  if (!isFirebaseConfigured()) {
    const cached = localStorage.getItem('jm_local_preview_admin_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // fallback
      }
    }
    return {
      username: DEFAULT_ADMIN_USERNAME,
      email: 'selvam@jminterior.in',
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const docRef = doc(db, ADMIN_PROFILE_PATH, ADMIN_PROFILE_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as AdminProfile;
    }
  } catch (err) {
    console.warn('Could not read admin profile from Firestore, using default mapping:', err);
  }

  // Sensible default if not seeded yet
  return {
    username: DEFAULT_ADMIN_USERNAME,
    email: 'selvam@jminterior.in',
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Signs in using Username and Password.
 * Resolves username -> email, then authenticates through Firebase Auth.
 */
export const loginWithUsername = async (usernameInput: string, password: string): Promise<User | null> => {
  const cleanUser = usernameInput.trim();
  const profile = await getAdminProfile();

  if (cleanUser.toLowerCase() !== profile.username.toLowerCase()) {
    throw new Error('Invalid username or credentials');
  }

  if (!isFirebaseConfigured()) {
    // Local preview mode without configured Firebase keys:
    // Accept the default initial credentials for local UI testing
    if (cleanUser === DEFAULT_ADMIN_USERNAME && password === 'SELVAM@7401279764') {
      const mockUser = {
        uid: 'local-admin-selvam',
        email: profile.email,
        displayName: cleanUser,
      } as unknown as User;
      localStorage.setItem('jm_local_preview_auth_user', JSON.stringify(mockUser));
      return mockUser;
    } else {
      throw new Error('Invalid username or password');
    }
  }

  // Real Firebase Authentication
  const userCredential = await signInWithEmailAndPassword(auth, profile.email, password);
  return userCredential.user;
};

/**
 * Logs out the administrator.
 */
export const logoutAdmin = async (): Promise<void> => {
  localStorage.removeItem('jm_local_preview_auth_user');
  if (isFirebaseConfigured()) {
    await signOut(auth);
  }
};

/**
 * Updates the administrative username in the Firestore profile document.
 */
export const updateAdminUsername = async (newUsername: string): Promise<void> => {
  const clean = newUsername.trim();
  if (!clean || clean.length < 3) {
    throw new Error('Username must be at least 3 characters.');
  }

  const profile = await getAdminProfile();
  const updated: AdminProfile = {
    ...profile,
    username: clean,
    updatedAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured()) {
    localStorage.setItem('jm_local_preview_admin_profile', JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, ADMIN_PROFILE_PATH, ADMIN_PROFILE_DOC);
  await setDoc(docRef, updated, { merge: true });
};

/**
 * Changes password securely via Firebase Auth re-authentication and updatePassword.
 */
export const updateAdminPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  if (newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters long.');
  }

  if (!isFirebaseConfigured()) {
    // Local preview simulation
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.email) {
    throw new Error('No authenticated admin session found. Please log in again.');
  }

  // Re-authenticate first to verify current password
  const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  await reauthenticateWithCredential(currentUser, credential);

  // Update password securely through Firebase Authentication
  await fbUpdatePassword(currentUser, newPassword);
};

/**
 * Subscribes to auth state changes.
 */
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (!isFirebaseConfigured()) {
    const local = localStorage.getItem('jm_local_preview_auth_user');
    callback(local ? JSON.parse(local) : null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};
