'use client';

import { useEffect, useState } from 'react';
import { getThemeByDate, type ThemeColors } from '@/lib/theme';

export function useThemeByDate() {
  const [theme, setTheme] = useState<ThemeColors>(getThemeByDate());

  useEffect(() => {
    // Update theme on mount and when date changes
    const updateTheme = () => {
      setTheme(getThemeByDate());
    };

    updateTheme();

    // Optional: Update theme at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      updateTheme();
      // Set up daily interval
      setInterval(updateTheme, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  return theme;
}
