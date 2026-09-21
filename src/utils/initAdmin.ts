import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { DEFAULT_SITE_SETTINGS } from './defaults';

export interface SetupResult {
  success: boolean;
  message: string;
}

/**
 * Initializes the first administrator and seeds default site settings into Cloud Firestore.
 * This should be executed once after connecting your Firebase project.
 */
export const initializeFirstAdminAndData = async (
  username = 'SELVAM',
  password = 'SELVAM@7401279764',
  adminEmail = 'selvam@jminterior.in'
): Promise<SetupResult> => {
  if (!isFirebaseConfigured()) {
    return {
      success: false,
      message: 'Firebase is not configured yet. Please add your VITE_FIREBASE_* variables to your environment or .env file first.',
    };
  }

  try {
    // 1. Create or verify Firebase Auth user
    try {
      await createUserWithEmailAndPassword(auth, adminEmail, password);
      console.log('Created Firebase Auth account for', adminEmail);
    } catch (authErr: any) {
      if (authErr.code === 'auth/email-already-in-use') {
        console.log('Firebase Auth account already exists. Verifying sign-in...');
        try {
          await signInWithEmailAndPassword(auth, adminEmail, password);
        } catch (signInErr) {
          console.log('User exists with different password. Proceeding with Firestore profile...');
        }
      } else {
        throw authErr;
      }
    }

    // 2. Create admin_profile document in Firestore
    const profileRef = doc(db, 'users', 'admin_profile');
    await setDoc(profileRef, {
      username: username.trim(),
      email: adminEmail.trim(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // 3. Initialize siteSettings if not present
    const settingsRef = doc(db, 'siteSettings', 'global');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, DEFAULT_SITE_SETTINGS);
      console.log('Initialized siteSettings/global document in Firestore.');
    }

    return {
      success: true,
      message: `Initial administrator "${username}" created and site settings initialized successfully!`,
    };
  } catch (err: any) {
    console.error('Initialization error:', err);
    return {
      success: false,
      message: `Setup failed: ${err.message}`,
    };
  }
};
