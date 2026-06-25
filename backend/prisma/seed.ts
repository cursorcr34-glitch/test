import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
];

const AMENITIES_POOL = [
  'Parking', 'Balcony', 'Elevator', 'Security', 'Gym', 'Pool',
  'Air Conditioning', 'Heating', 'Furnished', 'Internet',
];

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@emlak.az' },
    update: {},
    create: {
      email: 'admin@emlak.az',
      passwordHash,
      name: 'Admin User',
      phone: '+994501234567',
      role: 'ADMIN',
      locale: 'AZ',
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@emlak.az' },
    update: {},
    create: {
      email: 'seller@emlak.az',
      passwordHash,
      name: 'Elvin Məmmədov',
      phone: '+994501111111',
      role: 'SELLER',
      locale: 'AZ',
    },
  });

  const agentUser = await prisma.user.upsert({
    where: { email: 'agent@emlak.az' },
    update: {},
    create: {
      email: 'agent@emlak.az',
      passwordHash,
      name: 'Leyla Həsənova',
      phone: '+994502222222',
      role: 'AGENT',
      locale: 'AZ',
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@emlak.az' },
    update: {},
    create: {
      email: 'buyer@emlak.az',
      passwordHash,
      name: 'Rəşad Quliyev',
      phone: '+994503333333',
      role: 'BUYER',
      locale: 'AZ',
    },
  });

  const agent = await prisma.agent.upsert({
    where: { userId: agentUser.id },
    update: {},
    create: {
      userId: agentUser.id,
      licenseNumber: 'AZ-AGT-2024-001',
      bioAz: '10 illik təcrübəyə malik peşəkar agent',
      bioEn: 'Professional agent with 10 years of experience',
      bioRu: 'Профессиональный агент с 10-летним опытом',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      isActive: true,
    },
  });

  const properties = [
    {
      titleAz: 'Nərimanovda yeni tikili 3 otaqlı mənzil',
      titleEn: '3-room apartment in new building, Narimanov',
      titleRu: '3-комнатная квартира в новостройке, Нарimanов',
      descriptionAz: 'Nərimanov rayonunda yeni tikilidə geniş və işıqlı 3 otaqlı mənzil. Bütün infrastruktur yaxınlıqdadır.',
      descriptionEn: 'Spacious and bright 3-room apartment in a new building in Narimanov district. All infrastructure nearby.',
      descriptionRu: 'Просторная и светлая 3-комнатная квартира в новостройке в районе Нарimanов. Вся инфраструктура рядом.',
      price: 285000,
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      rooms: 3,
      area: 95,
      floor: 8,
      totalFloors: 16,
      district: 'NARIMANOV' as const,
      address: 'Nərimanov pr. 45',
      latitude: 40.4093,
      longitude: 49.8671,
    },
    {
      titleAz: 'Yasamalda kirayəyə verilir 2 otaqlı mənzil',
      titleEn: '2-room apartment for rent in Yasamal',
      titleRu: '2-комнатная квартира в аренду в Ясамале',
      descriptionAz: 'Yasamal rayonunda tam təchiz edilmiş 2 otaqlı mənzil kirayəyə verilir. Metroya 5 dəqiqəlik məsafədə.',
      descriptionEn: 'Fully furnished 2-room apartment for rent in Yasamal. 5 minutes walk to metro.',
      descriptionRu: 'Полностью меблированная 2-кomнатная квартира в аренду в Ясамале. 5 минут до метро.',
      price: 850,
      listingType: 'RENT' as const,
      propertyType: 'APARTMENT' as const,
      rooms: 2,
      area: 65,
      floor: 4,
      totalFloors: 9,
      district: 'YASAMAL' as const,
      address: 'Yasamal r-n, M. Hadi 12',
      latitude: 40.3858,
      longitude: 49.8206,
    },
    {
      titleAz: 'Xətaidə lüks 4 otaqlı penthaus',
      titleEn: 'Luxury 4-room penthouse in Khatai',
      titleRu: 'Роскошный 4-комнатный пентхаус в Хатаи',
      descriptionAz: 'Xətai rayonunda panoramik mənzərəli lüks penthaus. Dəniz mənzərəsi, açıq terras.',
      descriptionEn: 'Luxury penthouse with panoramic views in Khatai. Sea view, open terrace.',
      descriptionRu: 'Роскошный пентхаус с панорамным видом в Хатаи. Вид на море, открытая терраса.',
      price: 520000,
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      rooms: 4,
      area: 180,
      floor: 20,
      totalFloors: 20,
      district: 'XETAI' as const,
      address: 'Xətai pr. 78',
      latitude: 40.3733,
      longitude: 49.8603,
    },
    {
      titleAz: 'Səbaildə tarixi binada 2 otaqlı mənzil',
      titleEn: '2-room apartment in historic building, Sabail',
      titleRu: '2-комнатная квартира в историческом здании, Сабаил',
      descriptionAz: 'Səbail rayonunda tarixi binada bərpa edilmiş 2 otaqlı mənzil. İçərişəhərə yaxın.',
      descriptionEn: 'Renovated 2-room apartment in historic building in Sabail. Close to Old City.',
      descriptionRu: 'Отремонтированная 2-комнатная квартира в историческом здании в Сабаиле. Близко к Старому городу.',
      price: 195000,
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      rooms: 2,
      area: 72,
      floor: 3,
      totalFloors: 5,
      district: 'SEBAIL' as const,
      address: 'Səbail r-n, Neftçilər pr. 23',
      latitude: 40.3589,
      longitude: 49.8364,
    },
    {
      titleAz: 'Badamdar da villa kirayəyə',
      titleEn: 'Villa for rent in Badamdar',
      titleRu: 'Вилла в аренду в Бадамдаре',
      descriptionAz: 'Badamdar da dəniz mənzərəli müasir villa. Bağ, hovuz, 5 otaq.',
      descriptionEn: 'Modern villa with sea view in Badamdar. Garden, pool, 5 rooms.',
      descriptionRu: 'Современная вилла с видом на море в Бадамдаре. Сад, бассейн, 5 комнат.',
      price: 3500,
      listingType: 'RENT' as const,
      propertyType: 'HOUSE' as const,
      rooms: 5,
      area: 320,
      floor: 1,
      totalFloors: 2,
      district: 'BADAMDAR' as const,
      address: 'Badamdar, Sahil küç. 8',
      latitude: 40.3412,
      longitude: 49.8123,
    },
    {
      titleAz: 'Gəncədə yeni tikili 3 otaqlı mənzil',
      titleEn: '3-room apartment in new building, Ganja',
      titleRu: '3-комнатная квартира в новостройке, Гянджа',
      descriptionAz: 'Gəncə şəhərində yeni tikilidə sərfəli qiymətə 3 otaqlı mənzil.',
      descriptionEn: 'Affordable 3-room apartment in new building in Ganja city.',
      descriptionRu: 'Доступная 3-комнатная квартира в новостройке в городе Гянджа.',
      price: 95000,
      listingType: 'SALE' as const,
      propertyType: 'APARTMENT' as const,
      rooms: 3,
      area: 88,
      floor: 5,
      totalFloors: 12,
      district: 'GENCE' as const,
      address: 'Gəncə, Atatürk pr. 156',
      latitude: 40.6828,
      longitude: 46.3606,
    },
  ];

  for (const prop of properties) {
    await prisma.property.create({
      data: {
        ...prop,
        amenities: AMENITIES_POOL.slice(0, 4 + Math.floor(Math.random() * 4)),
        photos: PLACEHOLDER_PHOTOS,
        floorPlanUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        status: 'ACTIVE',
        ownerId: seller.id,
        agentId: agent.id,
      },
    });
  }

  const allProperties = await prisma.property.findMany({ take: 3 });

  for (const property of allProperties) {
    await prisma.inquiry.create({
      data: {
        propertyId: property.id,
        userId: buyer.id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone ?? '+994503333333',
        message: 'Salam, bu mənzil haqqında ətraflı məlumat almaq istəyirəm.',
        status: 'NEW',
      },
    });
  }

  await prisma.favorite.create({
    data: {
      userId: buyer.id,
      propertyId: allProperties[0].id,
    },
  });

  console.log('Seed completed successfully!');
  console.log('Test accounts (password: password123):');
  console.log('  Admin:  admin@emlak.az');
  console.log('  Seller: seller@emlak.az');
  console.log('  Agent:  agent@emlak.az');
  console.log('  Buyer:  buyer@emlak.az');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
