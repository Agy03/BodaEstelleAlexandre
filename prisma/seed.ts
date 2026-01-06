import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Wedding Info
  const existingWeddingInfo = await prisma.weddingInfo.findFirst();
  if (!existingWeddingInfo) {
    await prisma.weddingInfo.create({
      data: {
        weddingDate: 'Sábado, 20 de Junio de 2026',
        ceremonyTime: '16:00',
        cocktailTime: '17:30',
        dinnerPartyTime: '19:00',
        venueName: 'Château de la Belle Vue',
        venueAddress: '123 Rue de la Paix, 75001 París, Francia',
        venueLink: 'https://maps.google.com',
        venueLatitude: 48.8566,
        venueLongitude: 2.3522,
        dressCodeTitle: 'Elegante y Romántico',
        dressCodeDescription: 'Queremos que te sientas cómodo y hermoso en nuestro día especial. El código de vestimenta es elegante y romántico.',
        dressCodeMen: 'Traje o smoking en colores oscuros (negro, azul marino o gris). Corbata o pajarita opcional.',
        dressCodeWomen: 'Vestido de cóctel o largo en colores suaves y románticos. Evitar blanco, crema o marfil.',
        weatherSeason: 'Principios de Verano',
        weatherAvgTemp: '20-25°C (68-77°F)',
        weatherDescription: 'Junio en Francia ofrece un clima suave y agradable, perfecto para una celebración al aire libre.',
        weatherRecommendations: 'Traiga una chaqueta ligera o chal para la noche. Se recomiendan zapatos cómodos para áreas al aire libre.',
        parkingAvailable: true,
        parkingDescription: 'Estacionamiento gratuito disponible en el lugar. Servicio de valet proporcionado.',
        accommodationTitle: 'Dónde Alojarse',
        accommodationDescription: 'Hemos reservado bloques de habitaciones en hoteles cercanos. Consulte nuestra sección de Turismo para recomendaciones.',
        giftPolicy: 'Tu presencia es el mayor regalo. Si deseas honrarnos con un regalo, tenemos un registro disponible.',
        childrenPolicy: 'Amamos a tus pequeños, pero hemos planeado una celebración solo para adultos.',
        photographyNote: 'Hemos contratado a un fotógrafo profesional. Por favor, disfruta del momento sin dispositivos durante la ceremonia.',
        scheduleNote: 'Por favor, llegue 15 minutos antes de la ceremonia para asegurar que todos estén sentados a tiempo.',
        transportNote: 'Servicio de transporte disponible desde hoteles seleccionados. Los detalles se enviarán por correo electrónico.',
      },
    });
    console.log('Wedding info seeded!');
  } else {
    console.log('Wedding info already exists, skipping...');
  }

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
