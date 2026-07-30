import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { staticSettings } from '@/data';
import { SITE } from '@/constants';
import type { Settings } from '@/types';

interface SettingsContextValue {
  settings: Settings | null;
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const value = useMemo<SettingsContextValue>(
    () => ({ settings: staticSettings, isLoading: false }),
    []
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
