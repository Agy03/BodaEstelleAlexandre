import { prisma } from '@/lib/prisma';

const dressCodeMenByLocale = {
  es: 'No es necesario llevar smoking. Un traje formal en colores oscuros (negro, azul marino o gris) es perfecto. Corbata o pajarita opcional.',
  en: 'A tuxedo is not necessary. A formal suit in dark colors (black, navy, or charcoal) is perfect. Tie or bow tie optional.',
  fr: 'Le smoking n\'est pas necessaire. Un costume formel dans des couleurs foncees (noir, bleu marine ou gris) est parfait. Cravate ou noeud papillon en option.',
};

async function updateDressCode() {
  try {
    const weddingInfo = await prisma.weddingInfo.findFirst();

    if (!weddingInfo) {
      console.error('No wedding info found');
      process.exit(1);
    }

    const updated = await prisma.weddingInfo.update({
      where: { id: weddingInfo.id },
      data: {
        dressCodeMen: dressCodeMenByLocale.fr,
      },
    });

    await Promise.all(
      Object.entries(dressCodeMenByLocale).map(([locale, value]) =>
        prisma.translation.upsert({
          where: {
            entityType_entityId_field_locale: {
              entityType: 'WeddingInfo',
              entityId: weddingInfo.id,
              field: 'dressCodeMen',
              locale,
            },
          },
          update: { value },
          create: {
            entityType: 'WeddingInfo',
            entityId: weddingInfo.id,
            field: 'dressCodeMen',
            locale,
            value,
          },
        })
      )
    );

    console.log('Dress code updated successfully!');
    console.log('New men dress code:', updated.dressCodeMen);
  } catch (error) {
    console.error('Error updating dress code:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateDressCode();
