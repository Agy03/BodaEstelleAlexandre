import { prisma } from '@/lib/prisma';

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// Fields that should be translated for each entity type
export const TRANSLATABLE_FIELDS: Record<string, string[]> = {
  WeddingInfo: [
    'weddingDate',
    'dressCodeTitle',
    'dressCodeDescription',
    'dressCodeMen',
    'dressCodeWomen',
    'weatherSeason',
    'weatherAvgTemp',
    'weatherDescription',
    'weatherRecommendations',
    'parkingDescription',
    'accommodationTitle',
    'accommodationDescription',
    'giftPolicy',
    'childrenPolicy',
    'photographyNote',
    'scheduleNote',
    'transportNote',
  ],
  TourismPlace: ['name', 'description'],
  Gift: ['name', 'description'],
};

const SUPPORTED_LOCALES = ['es', 'en', 'fr'] as const;

/**
 * Preserve numbers from the original text in the translated text.
 * MyMemory sometimes changes numbers (e.g. 2026 → 2015).
 */
function preserveNumbers(original: string, translated: string): string {
  const originalNumbers = original.match(/\d+([.,]\d+)*/g) || [];
  const translatedNumbers = translated.match(/\d+([.,]\d+)*/g) || [];

  if (originalNumbers.length === 0 || originalNumbers.length !== translatedNumbers.length) {
    return translated;
  }

  let result = translated;
  for (let i = 0; i < originalNumbers.length; i++) {
    if (originalNumbers[i] !== translatedNumbers[i]) {
      result = result.replace(translatedNumbers[i], originalNumbers[i]);
    }
  }
  return result;
}

/**
 * Translate a single text string using MyMemory free API.
 * Falls back to original text if translation fails.
 */
async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text || text.trim() === '' || from === to) return text;

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `${from}|${to}`,
    });

    const response = await fetch(`${MYMEMORY_API}?${params.toString()}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return text;

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      // MyMemory returns the original in uppercase when it can't translate
      if (translated.toUpperCase() === translated && text.toUpperCase() !== text) {
        return text;
      }
      return preserveNumbers(text, translated);
    }

    return text;
  } catch {
    return text;
  }
}

/**
 * Translate multiple fields for an entity and save to the database.
 * Runs translations in parallel for speed.
 */
export async function autoTranslateEntity(
  entityType: string,
  entityId: string,
  data: Record<string, unknown>,
  sourceLocale: string
): Promise<void> {
  const fields = TRANSLATABLE_FIELDS[entityType];
  if (!fields) return;

  const targetLocales = SUPPORTED_LOCALES.filter((l) => l !== sourceLocale);

  // Collect fields that have non-empty string values
  const fieldsToTranslate = fields.filter(
    (f) => typeof data[f] === 'string' && (data[f] as string).trim() !== ''
  );

  if (fieldsToTranslate.length === 0) return;

  // Save source locale values as-is
  const sourceUpserts = fieldsToTranslate.map((field) =>
    prisma.translation.upsert({
      where: {
        entityType_entityId_field_locale: {
          entityType,
          entityId,
          field,
          locale: sourceLocale,
        },
      },
      update: { value: data[field] as string },
      create: {
        entityType,
        entityId,
        field,
        locale: sourceLocale,
        value: data[field] as string,
      },
    })
  );

  // Translate to each target locale
  const translationUpserts = targetLocales.flatMap((targetLocale) =>
    fieldsToTranslate.map(async (field) => {
      const translated = await translateText(
        data[field] as string,
        sourceLocale,
        targetLocale
      );

      return prisma.translation.upsert({
        where: {
          entityType_entityId_field_locale: {
            entityType,
            entityId,
            field,
            locale: targetLocale,
          },
        },
        update: { value: translated },
        create: {
          entityType,
          entityId,
          field,
          locale: targetLocale,
          value: translated,
        },
      });
    })
  );

  try {
    await Promise.all([...sourceUpserts, ...translationUpserts]);
  } catch (error) {
    // Translation failures are non-critical — log and continue
    console.error(`Translation error for ${entityType}/${entityId}:`, error);
  }
}

/**
 * Get translations for an entity and apply them to the data object.
 * If locale is 'es' (default source) and no translations exist, returns original.
 */
export async function getTranslatedEntity<T extends Record<string, unknown>>(
  entityType: string,
  entityId: string,
  entity: T,
  locale: string
): Promise<T> {
  const fields = TRANSLATABLE_FIELDS[entityType];
  if (!fields || locale === '') return entity;

  try {
    const translations = await prisma.translation.findMany({
      where: {
        entityType,
        entityId,
        locale,
        field: { in: fields },
      },
    });

    if (translations.length === 0) return entity;

    const translated = { ...entity };
    for (const t of translations) {
      if (t.field in entity) {
        (translated as Record<string, unknown>)[t.field] = t.value;
      }
    }

    return translated;
  } catch {
    return entity;
  }
}

/**
 * Get translations for multiple entities at once (batch).
 */
export async function getTranslatedEntities<T extends Record<string, unknown> & { id: string }>(
  entityType: string,
  entities: T[],
  locale: string
): Promise<T[]> {
  const fields = TRANSLATABLE_FIELDS[entityType];
  if (!fields || entities.length === 0) return entities;

  try {
    const entityIds = entities.map((e) => e.id);

    const translations = await prisma.translation.findMany({
      where: {
        entityType,
        entityId: { in: entityIds },
        locale,
        field: { in: fields },
      },
    });

    if (translations.length === 0) return entities;

    // Group translations by entityId
    const translationMap = new Map<string, Map<string, string>>();
    for (const t of translations) {
      if (!translationMap.has(t.entityId)) {
        translationMap.set(t.entityId, new Map());
      }
      translationMap.get(t.entityId)!.set(t.field, t.value);
    }

    return entities.map((entity) => {
      const fieldMap = translationMap.get(entity.id);
      if (!fieldMap) return entity;

      const translated = { ...entity };
      for (const [field, value] of fieldMap) {
        if (field in entity) {
          (translated as Record<string, unknown>)[field] = value;
        }
      }
      return translated;
    });
  } catch {
    return entities;
  }
}

/**
 * Detect locale from request cookies/headers.
 */
export function getLocaleFromRequest(request: Request): string {
  // Check NEXT_LOCALE cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const localeMatch = cookieHeader.match(/NEXT_LOCALE=(\w+)/);
  if (localeMatch && SUPPORTED_LOCALES.includes(localeMatch[1] as typeof SUPPORTED_LOCALES[number])) {
    return localeMatch[1];
  }

  // Check Accept-Language header
  const acceptLang = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0];
  if (acceptLang && SUPPORTED_LOCALES.includes(acceptLang as typeof SUPPORTED_LOCALES[number])) {
    return acceptLang;
  }

  return 'es';
}
