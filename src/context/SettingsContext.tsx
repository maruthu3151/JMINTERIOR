import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../utils/defaults';
import { getSiteSettings } from '../services/settingsService';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateLocalSettings: (updated: Partial<SiteSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings in context:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateLocalSettings = (updated: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateLocalSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};
