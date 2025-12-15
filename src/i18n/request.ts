import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

// Idiomas soportados
export const locales = ['es', 'en', 'fr'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async () => {
  // Detectar idioma desde cookie, header o usar default
  const cookieStore = await cookies();
  const headersList = await headers();
  
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const localeHeader = headersList.get('accept-language')?.split(',')[0]?.split('-')[0];
  
  let locale: Locale = defaultLocale;
  
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    locale = localeCookie as Locale;
  } else if (localeHeader && locales.includes(localeHeader as Locale)) {
    locale = localeHeader as Locale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
