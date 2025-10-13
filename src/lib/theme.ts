export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export function getThemeByDate(date: Date = new Date()): ThemeColors {
  const month = date.getMonth(); // 0-11

  // Enero (0) a marzo (2) → rojo, naranja y azul
  if (month >= 0 && month <= 2) {
    return {
      primary: '#DC2626', // red-600
      secondary: '#F97316', // orange-500
      accent: '#3B82F6', // blue-500
      background: '#FEF2F2', // red-50
      text: '#1F2937', // gray-800
    };
  }

  // Abril (3) en adelante → lila y plata
  return {
    primary: '#A855F7', // purple-500
    secondary: '#C084FC', // purple-400
    accent: '#94A3B8', // slate-400
    background: '#FAF5FF', // purple-50
    text: '#1E293B', // slate-800
  };
}

export function getThemeCSSVariables(colors: ThemeColors): Record<string, string> {
  return {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-text': colors.text,
  };
}
