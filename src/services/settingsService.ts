import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../utils/defaults';

const SETTINGS_DOC_PATH = 'siteSettings';
const SETTINGS_DOC_ID = 'global';

export const getSiteSettings = async (): Promise<SiteSettings> => {
  if (!isFirebaseConfigured()) {
    // If no Firebase credentials, read from memory/defaults
    const cached = localStorage.getItem('jm_local_preview_settings');
    if (cached) {
      try {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
      } catch (e) {
        return DEFAULT_SITE_SETTINGS;
      }
    }
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const docRef = doc(db, SETTINGS_DOC_PATH, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...DEFAULT_SITE_SETTINGS, ...(docSnap.data() as SiteSettings) };
    } else {
      // Return defaults if document is not yet seeded
      return DEFAULT_SITE_SETTINGS;
    }
  } catch (error) {
    console.error('Error fetching site settings from Firestore:', error);
    return DEFAULT_SITE_SETTINGS;
  }
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<void> => {
  const updatedData = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured()) {
    // Save locally for immediate feedback when running without keys
    const current = await getSiteSettings();
    const merged = { ...current, ...updatedData };
    localStorage.setItem('jm_local_preview_settings', JSON.stringify(merged));
    return;
  }

  const docRef = doc(db, SETTINGS_DOC_PATH, SETTINGS_DOC_ID);
  await setDoc(docRef, updatedData, { merge: true });
};
