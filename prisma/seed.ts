import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Tourism Places
  await prisma.tourismPlace.createMany({
    data: [
      {
        name: 'Hotel Ejemplo',
        type: 'hotel',
        description: 'Un hotel cómodo y cercano al lugar de la boda.',
        link: 'https://ejemplo.com/hotel',
      },
      {
        name: 'Restaurante Gourmet',
        type: 'restaurant',
        description: 'Cocina local excepcional en un ambiente acogedor.',
        link: 'https://ejemplo.com/restaurante',
      },
      {
        name: 'Museo de la Ciudad',
        type: 'culture',
        description: 'Descubre la historia y cultura de la región.',
        link: 'https://ejemplo.com/museo',
      },
      {
        name: 'Parque Nacional',
        type: 'leisure',
        description: 'Naturaleza impresionante para paseos y senderismo.',
        link: 'https://ejemplo.com/parque',
      },
    ],
  });

  // Seed Gifts (opcional)
  await prisma.gift.createMany({
    data: [
      {
        name: 'Juego de vajilla',
        description: 'Set completo de vajilla de porcelana',
        price: 150.0,
        link: 'https://amazon.es/ejemplo',
        reserved: false,
        purchased: false,
      },
      {
        name: 'Cafetera express',
        description: 'Máquina de café profesional',
        price: 200.0,
        link: 'https://amazon.es/ejemplo',
        reserved: false,
        purchased: false,
      },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
