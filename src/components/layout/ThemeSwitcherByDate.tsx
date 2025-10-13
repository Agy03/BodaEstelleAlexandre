'use client';

import { useThemeByDate } from '@/hooks/useThemeByDate';
import { getThemeCSSVariables } from '@/lib/theme';
import { ReactNode, useEffect } from 'react';

export function ThemeSwitcherByDate({ children }: { children: ReactNode }) {
  const theme = useThemeByDate();

  useEffect(() => {
    const root = document.documentElement;
    const variables = getThemeCSSVariables(theme);
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return <>{children}</>;
}
