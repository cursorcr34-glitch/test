import {
  PrismaClient,
  UserRole,
  Locale,
  ListingType,
  PropertyType,
  ListingStatus,
  InquiryStatus,
} from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

/** Deterministic demo password hash (password: "password123") for local development */
function hashPassword(password: string): string {
  return createHash("sha256").update(`emlak:${password}`).digest("hex");
}

const DISTRICTS = [
  {
    slug: "narimanov",
    nameAz: "Nərimanov",
    nameEn: "Narimanov",
    nameRu: "Нарimanov",
    city: "Baku",
    latitude: 40.4093,
    longitude: 49.8671,
  },
  {
    slug: "yasamal",
    nameAz: "Yasamal",
    nameEn: "Yasamal",
    nameRu: "Ясамал",
    city: "Baku",
    latitude: 40.3872,
    longitude: 49.8123,
  },
  {
    slug: "khatai",
    nameAz: "Xətai",
    nameEn: "Khatai",
    nameRu: "Хатаи",
    city: "Baku",
    latitude: 40.3769,
    longitude: 49.953,
  },
  {
    slug: "sabail",
    nameAz: "Səbail",
    nameEn: "Sabail",
    nameRu: "Сабаил",
    city: "Baku",
    latitude: 40.3588,
    longitude: 49.8346,
  },
  {
    slug: "badamdar",
    nameAz: "Badamdar",
    nameEn: "Badamdar",
    nameRu: "Бадамдар",
    city: "Baku",
    latitude: 40.3561,
    longitude: 49.8034,
  },
  {
    slug: "ganca",
    nameAz: "Gəncə",
    nameEn: "Ganja",
    nameRu: "Гянджа",
    city: "Ganja",
    latitude: 40.6828,
    longitude: 46.3606,
  },
] as const;

const AMENITIES = [
  {
    slug: "parking",
    nameAz: "Parking",
    nameEn: "Parking",
    nameRu: "Парковка",
    icon: "car",
    category: "building",
  },
  {
    slug: "elevator",
    nameAz: "Lift",
    nameEn: "Elevator",
    nameRu: "Лифт",
    icon: "elevator",
    category: "building",
  },
  {
    slug: "balcony",
    nameAz: "Balkon",
    nameEn: "Balcony",
    nameRu: "Балкон",
    icon: "balcony",
    category: "interior",
  },
  {
    slug: "air-conditioning",
    nameAz: "Kondisioner",
    nameEn: "Air Conditioning",
    nameRu: "Кондиционер",
    icon: "ac",
    category: "interior",
  },
  {
    slug: "security",
    nameAz: "Mühafizə",
    nameEn: "Security",
    nameRu: "Охрана",
    icon: "shield",
    category: "building",
  },
  {
    slug: "gym",
    nameAz: "İdman zalı",
    nameEn: "Gym",
    nameRu: "Спортзал",
    icon: "dumbbell",
    category: "building",
  },
  {
    slug: "swimming-pool",
    nameAz: "Hovuz",
    nameEn: "Swimming Pool",
    nameRu: "Бассейн",
    icon: "pool",
    category: "building",
  },
  {
    slug: "furnished",
    nameAz: "Mebelli",
    nameEn: "Furnished",
    nameRu: "Меблированная",
    icon: "sofa",
    category: "interior",
  },
  {
    slug: "sea-view",
    nameAz: "Dəniz mənzərəsi",
    nameEn: "Sea View",
    nameRu: "Вид на море",
    icon: "waves",
    category: "exterior",
  },
  {
    slug: "garden",
    nameAz: "Bağ",
    nameEn: "Garden",
    nameRu: "Сад",
    icon: "tree",
    category: "exterior",
  },
] as const;

const PLACEHOLDER_PHOTOS = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
];

const FLOOR_PLAN_URL =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80";

async function main() {
  console.log("Seeding Emlak database...");

  // Districts
  for (const district of DISTRICTS) {
    await prisma.district.upsert({
      where: { slug: district.slug },
      update: district,
      create: district,
    });
  }
  console.log(`  ✓ ${DISTRICTS.length} districts`);

  // Amenities
  for (const amenity of AMENITIES) {
    await prisma.amenity.upsert({
      where: { slug: amenity.slug },
      update: amenity,
      create: amenity,
    });
  }
  console.log(`  ✓ ${AMENITIES.length} amenities`);

  const districtMap = Object.fromEntries(
    (
      await prisma.district.findMany({
        select: { id: true, slug: true },
      })
    ).map((d) => [d.slug, d.id]),
  );

  const amenityMap = Object.fromEntries(
    (
      await prisma.amenity.findMany({
        select: { id: true, slug: true },
      })
    ).map((a) => [a.slug, a.id]),
  );

  const demoPassword = hashPassword("password123");

  // Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@emlak.az" },
    update: {},
    create: {
      email: "admin@emlak.az",
      passwordHash: demoPassword,
      firstName: "Admin",
      lastName: "Emlak",
      phone: "+994501234567",
      role: UserRole.ADMIN,
      locale: Locale.AZ,
    },
  });

  const agentUser = await prisma.user.upsert({
    where: { email: "agent@emlak.az" },
    update: {},
    create: {
      email: "agent@emlak.az",
      passwordHash: demoPassword,
      firstName: "Leyla",
      lastName: "Məmmədova",
      phone: "+994501112233",
      role: UserRole.AGENT,
      locale: Locale.AZ,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@emlak.az" },
    update: {},
    create: {
      email: "seller@emlak.az",
      passwordHash: demoPassword,
      firstName: "Rəşad",
      lastName: "Həsənov",
      phone: "+994502223344",
      role: UserRole.SELLER,
      locale: Locale.AZ,
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@emlak.az" },
    update: {},
    create: {
      email: "buyer@emlak.az",
      passwordHash: demoPassword,
      firstName: "Aysel",
      lastName: "Quliyeva",
      phone: "+994503334455",
      role: UserRole.BUYER,
      locale: Locale.EN,
    },
  });

  console.log("  ✓ 4 demo users (admin, agent, seller, buyer)");

  const agentProfile = await prisma.agentProfile.upsert({
    where: { userId: agentUser.id },
    update: {
      bioAz:
        "Bakıda 8 illik təcrübəyə malik lisenziyalı agent. Nərimanov və Yasamal rayonlarında ixtisaslaşmışam.",
      bioEn:
        "Licensed agent with 8 years of experience in Baku. Specialized in Narimanov and Yasamal districts.",
      bioRu:
        "Лицензированный агент с 8-летним опытом работы в Баку. Специализация — районы Нарimanov и Yasamal.",
      agencyName: "Emlak Premium",
      rating: 4.8,
      isVerified: true,
    },
    create: {
      userId: agentUser.id,
      licenseNo: "AZ-AG-2024-001",
      bioAz:
        "Bakıda 8 illik təcrübəyə malik lisenziyalı agent. Nərimanov və Yasamal rayonlarında ixtisaslaşmışam.",
      bioEn:
        "Licensed agent with 8 years of experience in Baku. Specialized in Narimanov and Yasamal districts.",
      bioRu:
        "Лицензированный агент с 8-летним опытом работы в Баку. Специализация — районы Нарimanov и Yasamal.",
      agencyName: "Emlak Premium",
      rating: 4.8,
      isVerified: true,
    },
  });

  console.log("  ✓ 1 agent profile");

  type PropertySeed = {
    slug: string;
    listingType: ListingType;
    propertyType: PropertyType;
    status: ListingStatus;
    price: number;
    districtSlug: keyof typeof districtMap;
    addressAz: string;
    addressEn: string;
    addressRu: string;
    latitude: number;
    longitude: number;
    titleAz: string;
    titleEn: string;
    titleRu: string;
    descriptionAz: string;
    descriptionEn: string;
    descriptionRu: string;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    areaSqm: number;
    floor?: number;
    totalFloors?: number;
    yearBuilt?: number;
    ownerId: string;
    agentId: string;
    isFeatured: boolean;
    amenitySlugs: string[];
  };

  const properties: PropertySeed[] = [
    {
      slug: "narimanov-3-otaqli-satisi",
      listingType: ListingType.SALE,
      propertyType: PropertyType.APARTMENT,
      status: ListingStatus.ACTIVE,
      price: 285000,
      districtSlug: "narimanov",
      addressAz: "Nərimanov, Təbriz küçəsi 45",
      addressEn: "45 Tabriz Street, Narimanov",
      addressRu: "ул. Тебриз 45, Нарimanov",
      latitude: 40.4098,
      longitude: 49.8685,
      titleAz: "Nərimanovda təmirli 3 otaqlı mənzil",
      titleEn: "Renovated 3-room apartment in Narimanov",
      titleRu: "Отремонтированная 3-комнатная квартира в Нарimanov",
      descriptionAz:
        "Mərkəzi yerləşmə, tam təmir, geniş balkon. Metroya 5 dəqiqəlik piyada məsafə.",
      descriptionEn:
        "Central location, fully renovated, spacious balcony. 5-minute walk to metro.",
      descriptionRu:
        "Центральное расположение, полный ремонт, просторный балкон. 5 минут пешком до метро.",
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      areaSqm: 92,
      floor: 7,
      totalFloors: 12,
      yearBuilt: 2015,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: true,
      amenitySlugs: ["elevator", "balcony", "air-conditioning", "parking"],
    },
    {
      slug: "yasamal-2-otaqli-icare",
      listingType: ListingType.RENT,
      propertyType: PropertyType.APARTMENT,
      status: ListingStatus.ACTIVE,
      price: 850,
      districtSlug: "yasamal",
      addressAz: "Yasamal, Hüseyn Cavid prospekti 112",
      addressEn: "112 Huseyn Javid Avenue, Yasamal",
      addressRu: "пр. Гусейна Джавида 112, Ясамал",
      latitude: 40.3881,
      longitude: 49.8142,
      titleAz: "Yasamaldə mebelli 2 otaqlı kirayə",
      titleEn: "Furnished 2-room rental in Yasamal",
      titleRu: "Меблированная 2-комнатная квартира в Ясамал",
      descriptionAz:
        "Universitet yaxınlığında, mebelli, kommunal xərclər daxildir. Uzunmüddətli kirayə.",
      descriptionEn:
        "Near university, furnished, utilities included. Long-term lease preferred.",
      descriptionRu:
        "Рядом с университетом, меблированная, коммунальные включены. Долгосрочная аренда.",
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      areaSqm: 58,
      floor: 3,
      totalFloors: 9,
      yearBuilt: 2010,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: true,
      amenitySlugs: ["furnished", "elevator", "balcony"],
    },
    {
      slug: "khatai-yeni-tikili-satisi",
      listingType: ListingType.SALE,
      propertyType: PropertyType.APARTMENT,
      status: ListingStatus.ACTIVE,
      price: 195000,
      districtSlug: "khatai",
      addressAz: "Xətai, Zığ prospekti 78",
      addressEn: "78 Zig Avenue, Khatai",
      addressRu: "пр. Зиг 78, Хатаи",
      latitude: 40.3775,
      longitude: 49.9512,
      titleAz: "Xətaidə yeni tikili 2 otaqlı mənzil",
      titleEn: "New building 2-room apartment in Khatai",
      titleRu: "2-комнатная квартира в новостройке, Хатаи",
      descriptionAz: "Yeni tikili kompleks, açıq mətbəx, parking yeri mövcuddur.",
      descriptionEn: "New residential complex, open kitchen, parking available.",
      descriptionRu: "Новый жилой комплекс, открытая кухня, есть парковка.",
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      areaSqm: 72,
      floor: 11,
      totalFloors: 16,
      yearBuilt: 2022,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: false,
      amenitySlugs: ["parking", "elevator", "security"],
    },
    {
      slug: "sabail-deniz-menzere-satisi",
      listingType: ListingType.SALE,
      propertyType: PropertyType.APARTMENT,
      status: ListingStatus.ACTIVE,
      price: 520000,
      districtSlug: "sabail",
      addressAz: "Səbail, Neftçilər prospekti 152",
      addressEn: "152 Neftchilar Avenue, Sabail",
      addressRu: "пр. Нефтяников 152, Сабаил",
      latitude: 40.3595,
      longitude: 49.8362,
      titleAz: "Səbaildə dəniz mənzərəli premium mənzil",
      titleEn: "Premium sea-view apartment in Sabail",
      titleRu: "Премиальная квартира с видом на море, Сабаил",
      descriptionAz:
        "Dəniz mənzərəsi, premium təmir, 24/7 mühafizə, hovuz və idman zalı.",
      descriptionEn:
        "Sea view, premium finish, 24/7 security, pool and gym access.",
      descriptionRu:
        "Вид на море, премиальная отделка, охрана 24/7, бассейн и спортзал.",
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 145,
      floor: 18,
      totalFloors: 25,
      yearBuilt: 2019,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: true,
      amenitySlugs: [
        "sea-view",
        "security",
        "gym",
        "swimming-pool",
        "parking",
        "elevator",
      ],
    },
    {
      slug: "badamdar-villa-satisi",
      listingType: ListingType.SALE,
      propertyType: PropertyType.VILLA,
      status: ListingStatus.ACTIVE,
      price: 890000,
      districtSlug: "badamdar",
      addressAz: "Badamdar, Sahil yolu 23",
      addressEn: "23 Coastal Road, Badamdar",
      addressRu: "Приморское шоссе 23, Бадамдар",
      latitude: 40.3568,
      longitude: 49.8041,
      titleAz: "Badamdarda bağlı villa",
      titleEn: "Villa with garden in Badamdar",
      titleRu: "Вилла с садом в Бадамдар",
      descriptionAz:
        "Dənizə yaxın, geniş bağ, 5 otaq, qaraj. Sakit və prestijli ərazi.",
      descriptionEn:
        "Near the sea, large garden, 5 rooms, garage. Quiet prestigious area.",
      descriptionRu:
        "Близко к морю, большой сад, 5 комнат, гараж. Тихий престижный район.",
      rooms: 5,
      bedrooms: 4,
      bathrooms: 3,
      areaSqm: 320,
      yearBuilt: 2017,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: true,
      amenitySlugs: ["garden", "sea-view", "parking", "security"],
    },
    {
      slug: "ganca-ev-satisi",
      listingType: ListingType.SALE,
      propertyType: PropertyType.HOUSE,
      status: ListingStatus.ACTIVE,
      price: 125000,
      districtSlug: "ganca",
      addressAz: "Gəncə, Nizami küçəsi 67",
      addressEn: "67 Nizami Street, Ganja",
      addressRu: "ул. Низами 67, Гянджа",
      latitude: 40.6835,
      longitude: 46.3618,
      titleAz: "Gəncədə 4 otaqlı ev",
      titleEn: "4-room house in Ganja",
      titleRu: "4-комнатный дом в Гяндже",
      descriptionAz:
        "Mərkəzdə, tam təmir, həyətli ev. Məktəb və xəstəxanaya yaxın.",
      descriptionEn:
        "Central location, fully renovated courtyard house. Near school and hospital.",
      descriptionRu:
        "Центр города, отремонтированный дом с двором. Рядом школа и больница.",
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      areaSqm: 180,
      yearBuilt: 2008,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: false,
      amenitySlugs: ["garden", "parking"],
    },
    {
      slug: "narimanov-ofis-icare",
      listingType: ListingType.RENT,
      propertyType: PropertyType.OFFICE,
      status: ListingStatus.ACTIVE,
      price: 2200,
      districtSlug: "narimanov",
      addressAz: "Nərimanov, Atatürk prospekti 89",
      addressEn: "89 Ataturk Avenue, Narimanov",
      addressRu: "пр. Ататюрка 89, Нарimanov",
      latitude: 40.4105,
      longitude: 49.8692,
      titleAz: "Nərimanovda ofis kirayəsi",
      titleEn: "Office space for rent in Narimanov",
      titleRu: "Офисное помещение в аренду, Нарimanov",
      descriptionAz: "Biznes mərkəzində, açıq plan, lift və parking.",
      descriptionEn: "Business center location, open plan, elevator and parking.",
      descriptionRu: "Бизнес-центр, open space, лифт и парковка.",
      rooms: 1,
      areaSqm: 110,
      floor: 5,
      totalFloors: 10,
      yearBuilt: 2018,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: false,
      amenitySlugs: ["elevator", "parking", "security", "air-conditioning"],
    },
    {
      slug: "yasamal-satisi-gundelik",
      listingType: ListingType.SALE,
      propertyType: PropertyType.APARTMENT,
      status: ListingStatus.SOLD,
      price: 165000,
      districtSlug: "yasamal",
      addressAz: "Yasamal, M. Hadi küçəsi 34",
      addressEn: "34 M. Hadi Street, Yasamal",
      addressRu: "ул. М. Хади 34, Ясамал",
      latitude: 40.3865,
      longitude: 49.811,
      titleAz: "Yasamaldə satılmış 2 otaqlı mənzil (analitika)",
      titleEn: "Sold 2-room apartment in Yasamal (analytics sample)",
      titleRu: "Проданная 2-комнатная квартира в Ясамал (для аналитики)",
      descriptionAz: "Dashboard analitikası üçün satılmış elan nümunəsi.",
      descriptionEn: "Sold listing sample for dashboard analytics.",
      descriptionRu: "Пример проданного объявления для аналитики.",
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      areaSqm: 65,
      floor: 2,
      totalFloors: 5,
      yearBuilt: 2005,
      ownerId: seller.id,
      agentId: agentProfile.id,
      isFeatured: false,
      amenitySlugs: ["balcony"],
    },
  ];

  const createdProperties: { id: string; slug: string }[] = [];

  for (const prop of properties) {
    const { amenitySlugs, districtSlug, ...data } = prop;

    const property = await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {
        ...data,
        districtId: districtMap[districtSlug],
        publishedAt:
          data.status === ListingStatus.ACTIVE
            ? new Date("2025-01-15")
            : data.status === ListingStatus.SOLD
              ? new Date("2024-11-01")
              : null,
      },
      create: {
        ...data,
        districtId: districtMap[districtSlug],
        publishedAt:
          data.status === ListingStatus.ACTIVE
            ? new Date("2025-01-15")
            : data.status === ListingStatus.SOLD
              ? new Date("2024-11-01")
              : null,
      },
    });

    createdProperties.push({ id: property.id, slug: property.slug });

    await prisma.propertyAmenity.deleteMany({
      where: { propertyId: property.id },
    });

    for (const slug of amenitySlugs) {
      const amenityId = amenityMap[slug];
      if (amenityId) {
        await prisma.propertyAmenity.create({
          data: { propertyId: property.id, amenityId },
        });
      }
    }

    await prisma.propertyPhoto.deleteMany({ where: { propertyId: property.id } });
    for (let i = 0; i < PLACEHOLDER_PHOTOS.length; i++) {
      await prisma.propertyPhoto.create({
        data: {
          propertyId: property.id,
          url: PLACEHOLDER_PHOTOS[i],
          sortOrder: i,
          isPrimary: i === 0,
          altAz: `${prop.titleAz} — foto ${i + 1}`,
          altEn: `${prop.titleEn} — photo ${i + 1}`,
          altRu: `${prop.titleRu} — фото ${i + 1}`,
        },
      });
    }

    await prisma.floorPlan.deleteMany({ where: { propertyId: property.id } });
    await prisma.floorPlan.create({
      data: {
        propertyId: property.id,
        url: FLOOR_PLAN_URL,
        labelAz: "Mərtəbə planı",
        labelEn: "Floor plan",
        labelRu: "План этажа",
        areaSqm: prop.areaSqm,
        sortOrder: 0,
      },
    });
  }

  await prisma.agentProfile.update({
    where: { id: agentProfile.id },
    data: {
      listingsCount: properties.filter((p) => p.status === ListingStatus.ACTIVE)
        .length,
    },
  });

  console.log(`  ✓ ${properties.length} properties with photos, amenities, floor plans`);

  const featuredProperty = createdProperties.find(
    (p) => p.slug === "narimanov-3-otaqli-satisi",
  );
  const rentProperty = createdProperties.find(
    (p) => p.slug === "yasamal-2-otaqli-icare",
  );

  if (featuredProperty) {
    await prisma.favorite.upsert({
      where: {
        userId_propertyId: {
          userId: buyer.id,
          propertyId: featuredProperty.id,
        },
      },
      update: {},
      create: {
        userId: buyer.id,
        propertyId: featuredProperty.id,
      },
    });

    const inquiry = await prisma.inquiry.upsert({
      where: { id: "seed-inquiry-narimanov" },
      update: {},
      create: {
        id: "seed-inquiry-narimanov",
        propertyId: featuredProperty.id,
        userId: buyer.id,
        assignedAgentId: agentUser.id,
        name: `${buyer.firstName} ${buyer.lastName}`,
        email: buyer.email,
        phone: buyer.phone ?? "+994503334455",
        message:
          "Salam, bu mənzil haqqında ətraflı məlumat almaq istəyirəm. Baxış üçün vaxt təyin edə bilərik?",
        status: InquiryStatus.VIEWING_SCHEDULED,
        respondedAt: new Date("2025-06-10"),
      },
    });

    await prisma.inquiryStatusHistory.deleteMany({
      where: { inquiryId: inquiry.id },
    });

    await prisma.inquiryStatusHistory.createMany({
      data: [
        {
          inquiryId: inquiry.id,
          fromStatus: null,
          toStatus: InquiryStatus.NEW,
          note: "Inquiry submitted via web",
        },
        {
          inquiryId: inquiry.id,
          fromStatus: InquiryStatus.NEW,
          toStatus: InquiryStatus.CONTACTED,
          note: "Agent called buyer",
          changedById: agentUser.id,
        },
        {
          inquiryId: inquiry.id,
          fromStatus: InquiryStatus.CONTACTED,
          toStatus: InquiryStatus.VIEWING_SCHEDULED,
          note: "Viewing scheduled for Saturday 14:00",
          changedById: agentUser.id,
        },
      ],
    });
  }

  if (rentProperty) {
    await prisma.inquiry.upsert({
      where: { id: "seed-inquiry-yasamal-rent" },
      update: {},
      create: {
        id: "seed-inquiry-yasamal-rent",
        propertyId: rentProperty.id,
        name: "Elvin Rəhimov",
        email: "elvin@example.com",
        phone: "+994504445566",
        message: "Is this apartment still available for long-term rent?",
        status: InquiryStatus.NEW,
      },
    });
  }

  const closedInquiry = createdProperties.find(
    (p) => p.slug === "yasamal-satisi-gundelik",
  );
  if (closedInquiry) {
    await prisma.inquiry.upsert({
      where: { id: "seed-inquiry-closed-won" },
      update: {},
      create: {
        id: "seed-inquiry-closed-won",
        propertyId: closedInquiry.id,
        userId: buyer.id,
        assignedAgentId: agentUser.id,
        name: `${buyer.firstName} ${buyer.lastName}`,
        email: buyer.email,
        phone: buyer.phone ?? "+994503334455",
        message: "Interested in purchasing this property.",
        status: InquiryStatus.CLOSED_WON,
        respondedAt: new Date("2024-10-15"),
        closedAt: new Date("2024-11-01"),
      },
    });
  }

  console.log("  ✓ favorites and inquiries with status history");

  console.log("\nSeed complete.");
  console.log("Demo credentials (password: password123):");
  console.log("  admin@emlak.az  — ADMIN");
  console.log("  agent@emlak.az  — AGENT");
  console.log("  seller@emlak.az — SELLER");
  console.log("  buyer@emlak.az  — BUYER");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
