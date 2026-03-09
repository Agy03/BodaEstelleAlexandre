/**
 * Script to translate all existing database content.
 * Run with: npx tsx scripts/translate-existing.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const SOURCE_LOCALE = 'fr'; // Content was entered in French
const TARGET_LOCALES = ['en', 'es'];

const TRANSLATABLE_FIELDS: Record<string, string[]> = {
  WeddingInfo: [
    'weddingDate', 'dressCodeTitle', 'dressCodeDescription',
    'dressCodeMen', 'dressCodeWomen', 'weatherSeason', 'weatherAvgTemp',
    'weatherDescription', 'weatherRecommendations', 'parkingDescription',
    'accommodationTitle', 'accommodationDescription', 'giftPolicy',
    'childrenPolicy', 'photographyNote', 'scheduleNote', 'transportNote',
  ],
  TourismPlace: ['name', 'description'],
  Gift: ['name', 'description'],
};

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

async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text || text.trim() === '' || from === to) return text;

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `${from}|${to}`,
    });

    const response = await fetch(`${MYMEMORY_API}?${params.toString()}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return text;

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
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

async function translateEntity(
  entityType: string,
  entityId: string,
  data: Record<string, unknown>
) {
  const fields = TRANSLATABLE_FIELDS[entityType];
  if (!fields) return;

  const fieldsToTranslate = fields.filter(
    (f) => typeof data[f] === 'string' && (data[f] as string).trim() !== ''
  );

  if (fieldsToTranslate.length === 0) return;

  // Save source locale
  for (const field of fieldsToTranslate) {
    await prisma.translation.upsert({
      where: {
        entityType_entityId_field_locale: {
          entityType, entityId, field, locale: SOURCE_LOCALE,
        },
      },
      update: { value: data[field] as string },
      create: {
        entityType, entityId, field,
        locale: SOURCE_LOCALE,
        value: data[field] as string,
      },
    });
  }

  // Translate to each target locale
  for (const targetLocale of TARGET_LOCALES) {
    for (const field of fieldsToTranslate) {
      const original = data[field] as string;
      console.log(`  [${targetLocale}] ${field}: "${original.substring(0, 50)}..."`);

      const translated = await translateText(original, SOURCE_LOCALE, targetLocale);

      await prisma.translation.upsert({
        where: {
          entityType_entityId_field_locale: {
            entityType, entityId, field, locale: targetLocale,
          },
        },
        update: { value: translated },
        create: {
          entityType, entityId, field,
          locale: targetLocale,
          value: translated,
        },
      });

      // Small delay to respect API rate limits
      await new Promise((r) => setTimeout(r, 300));
    }
  }
}

async function main() {
  console.log('🌐 Translating existing database content...\n');

  // 1. Wedding Info
  const weddingInfo = await prisma.weddingInfo.findFirst();
  if (weddingInfo) {
    console.log('📋 Translating Wedding Info...');
    await translateEntity('WeddingInfo', weddingInfo.id, weddingInfo as unknown as Record<string, unknown>);
    console.log('  ✅ Done\n');
  }

  // 2. Tourism Places
  const places = await prisma.tourismPlace.findMany();
  console.log(`🗺️  Translating ${places.length} tourism places...`);
  for (const place of places) {
    console.log(`  → ${place.name}`);
    await translateEntity('TourismPlace', place.id, place as unknown as Record<string, unknown>);
  }
  console.log('  ✅ Done\n');

  // 3. Gifts
  const gifts = await prisma.gift.findMany();
  console.log(`🎁 Translating ${gifts.length} gifts...`);
  for (const gift of gifts) {
    console.log(`  → ${gift.name}`);
    await translateEntity('Gift', gift.id, gift as unknown as Record<string, unknown>);
  }
  console.log('  ✅ Done\n');

  // Summary
  const count = await prisma.translation.count();
  console.log(`\n✨ Finished! ${count} translations saved in the database.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
