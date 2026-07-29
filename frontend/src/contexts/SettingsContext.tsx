import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { settingsApi } from '@/api';
import { SITE } from '@/constants';
import type { Settings } from '@/types';

interface SettingsContextValue {
  settings: Settings | null;
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    settingsApi
      .getPublic()
      .then((res) => {
        if (mounted) setSettings(res.data);
      })
      .catch(() => {
        // fall back silently to static SITE constants
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, isLoading }),
    [settings, isLoading]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function getFallbackSettings(): Pick<
  Settings,
  'companyName' | 'tagline' | 'email' | 'phone' | 'whatsapp' | 'address' | 'socialLinks'
> {
  return {
    companyName: SITE.fullName,
    tagline: SITE.tagline,
    email: SITE.email,
    phone: SITE.phone,
    whatsapp: SITE.whatsapp,
    address: SITE.address,
    socialLinks: SITE.social,
  };
}
