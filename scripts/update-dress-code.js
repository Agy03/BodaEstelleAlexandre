const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
        dressCodeTitle: 'Royal',
        dressCodeDescription: 'Nous voulons que vous vous sentez à l\'aise lors de notre journée spéciale. Le code vestimentaire est élégant et romantique.',
        dressCodeMen: 'Costume ou smoking en couleurs foncées (noir, bleu marine ou gris). Cravate ou noeud papillon en option.',
        dressCodeWomen: 'Robe de cocktail ou longue dans des couleurs douces et romantiques. Éviter le blanc, la crème ou l\'ivoire.',
      },
    });

    console.log('✅ Dress code updated successfully!');
    console.log('New dress code title:', updated.dressCodeTitle);
    console.log('Updated by:', updated.updatedBy);
  } catch (error) {
    console.error('Error updating dress code:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateDressCode();
