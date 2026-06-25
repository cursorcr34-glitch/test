import {
  PrismaClient,
  Role,
  Transmission,
  FuelType,
  CarStatus,
  FeatureCategory,
  AddOnPricingType,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Rent-A-Car database...");

  // ─── Users ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@rentacar.az" },
    update: {},
    create: {
      email: "admin@rentacar.az",
      passwordHash: "$2a$12$6yLwJd2P..D7h3fQ24WdDuyUdsOQRRCr3OTU7i6.xJ/IQWIQq.e6u",
      firstName: "Admin",
      lastName: "User",
      phone: "+994501234567",
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: "$2a$12$6yLwJd2P..D7h3fQ24WdDuyUdsOQRRCr3OTU7i6.xJ/IQWIQq.e6u",
      firstName: "Elvin",
      lastName: "Mammadov",
      phone: "+994551112233",
      role: Role.CUSTOMER,
    },
  });

  // ─── Locations ──────────────────────────────────────────────────────────────
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { slug: "baku-airport" },
      update: {},
      create: {
        name: "Heydər Əliyev Beynəlxalq Hava Limanı",
        slug: "baku-airport",
        city: "Bakı",
        address: "AZ-1044, Bakı",
        latitude: 40.4675,
        longitude: 50.0467,
      },
    }),
    prisma.location.upsert({
      where: { slug: "baku-city-center" },
      update: {},
      create: {
        name: "Bakı Şəhər Mərkəzi",
        slug: "baku-city-center",
        city: "Bakı",
        address: "28 May küçəsi 15, Bakı",
        latitude: 40.3777,
        longitude: 49.892,
      },
    }),
    prisma.location.upsert({
      where: { slug: "ganja" },
      update: {},
      create: {
        name: "Gəncə Filialı",
        slug: "ganja",
        city: "Gəncə",
        address: "Atatürk prospekti 45, Gəncə",
        latitude: 40.6828,
        longitude: 46.3606,
      },
    }),
    prisma.location.upsert({
      where: { slug: "sheki" },
      update: {},
      create: {
        name: "Şəki Filialı",
        slug: "sheki",
        city: "Şəki",
        address: "M.F. Axundov küçəsi 12, Şəki",
        latitude: 41.1919,
        longitude: 47.1706,
      },
    }),
  ]);

  const [airport, cityCenter, ganja, sheki] = locations;

  // ─── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "economy" },
      update: {},
      create: {
        name: "Economy",
        slug: "economy",
        description: "Sərfəli və yanacaq qənaətli avtomobillər",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "sedan" },
      update: {},
      create: {
        name: "Sedan",
        slug: "sedan",
        description: "Rahat və geniş sedan modellər",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "suv" },
      update: {},
      create: {
        name: "SUV",
        slug: "suv",
        description: "Ailə səyahətləri və off-road üçün",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "luxury" },
      update: {},
      create: {
        name: "Luxury",
        slug: "luxury",
        description: "Premium və lüks avtomobillər",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "electric" },
      update: {},
      create: {
        name: "Electric",
        slug: "electric",
        description: "Elektrik və hibrid avtomobillər",
        sortOrder: 5,
      },
    }),
  ]);

  const [economy, sedan, suv, luxury, electric] = categories;

  // ─── Cars ───────────────────────────────────────────────────────────────────
  const carData = [
    {
      slug: "hyundai-elantra-2024",
      make: "Hyundai",
      model: "Elantra",
      year: 2024,
      categoryId: economy.id,
      locationId: airport.id,
      dailyRate: 45,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      seats: 5,
      doors: 4,
      luggage: 2,
      horsepower: 147,
      color: "Ağ",
      licensePlate: "10-AA-001",
      isPopular: true,
      description:
        "Sərfəli və etibarlı Hyundai Elantra — şəhər və uzun yol səyahətləri üçün ideal.",
      images: [
        {
          url: "/images/cars/hyundai-elantra-1.jpg",
          alt: "Hyundai Elantra front view",
          isPrimary: true,
        },
        {
          url: "/images/cars/hyundai-elantra-2.jpg",
          alt: "Hyundai Elantra interior",
        },
      ],
      features: [
        { name: "Bluetooth", category: FeatureCategory.ENTERTAINMENT },
        { name: "Klima kontrol", category: FeatureCategory.COMFORT },
        { name: "ABS", category: FeatureCategory.SAFETY },
        { name: "Airbag", category: FeatureCategory.SAFETY },
      ],
    },
    {
      slug: "toyota-camry-2023",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      categoryId: sedan.id,
      locationId: cityCenter.id,
      dailyRate: 65,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.HYBRID,
      seats: 5,
      doors: 4,
      luggage: 3,
      horsepower: 208,
      color: "Gümüş",
      licensePlate: "10-BB-002",
      isPopular: true,
      description:
        "Toyota Camry Hybrid — səssiz, rahat və yanacaq qənaətli premium sedan.",
      images: [
        {
          url: "/images/cars/toyota-camry-1.jpg",
          alt: "Toyota Camry front view",
          isPrimary: true,
        },
        {
          url: "/images/cars/toyota-camry-2.jpg",
          alt: "Toyota Camry side view",
        },
        {
          url: "/images/cars/toyota-camry-3.jpg",
          alt: "Toyota Camry dashboard",
        },
      ],
      features: [
        { name: "Apple CarPlay", category: FeatureCategory.ENTERTAINMENT },
        { name: "Android Auto", category: FeatureCategory.ENTERTAINMENT },
        { name: "Adaptive Cruise Control", category: FeatureCategory.SAFETY },
        { name: "Lane Assist", category: FeatureCategory.SAFETY },
        { name: "Leather seats", category: FeatureCategory.COMFORT },
      ],
    },
    {
      slug: "bmw-x5-2024",
      make: "BMW",
      model: "X5",
      year: 2024,
      categoryId: suv.id,
      locationId: airport.id,
      dailyRate: 120,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.DIESEL,
      seats: 7,
      doors: 5,
      luggage: 4,
      horsepower: 286,
      color: "Qara",
      licensePlate: "10-CC-003",
      isPopular: true,
      description:
        "BMW X5 — güclü SUV, geniş salon və premium sürüş təcrübəsi.",
      images: [
        {
          url: "/images/cars/bmw-x5-1.jpg",
          alt: "BMW X5 front view",
          isPrimary: true,
        },
        {
          url: "/images/cars/bmw-x5-2.jpg",
          alt: "BMW X5 rear view",
        },
      ],
      features: [
        { name: "Panoramic roof", category: FeatureCategory.COMFORT },
        { name: "Navigation system", category: FeatureCategory.ENTERTAINMENT },
        { name: "Parking sensors", category: FeatureCategory.SAFETY },
        { name: "360° camera", category: FeatureCategory.SAFETY },
        { name: "xDrive AWD", category: FeatureCategory.PERFORMANCE },
      ],
    },
    {
      slug: "mercedes-e-class-2024",
      make: "Mercedes-Benz",
      model: "E-Class",
      year: 2024,
      categoryId: luxury.id,
      locationId: cityCenter.id,
      dailyRate: 150,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      seats: 5,
      doors: 4,
      luggage: 3,
      horsepower: 255,
      color: "Göy",
      licensePlate: "10-DD-004",
      isPopular: true,
      description:
        "Mercedes-Benz E-Class — lüks, texnologiya və rahatlığın mükəmməl birləşməsi.",
      images: [
        {
          url: "/images/cars/mercedes-e-class-1.jpg",
          alt: "Mercedes E-Class front view",
          isPrimary: true,
        },
        {
          url: "/images/cars/mercedes-e-class-2.jpg",
          alt: "Mercedes E-Class interior",
        },
      ],
      features: [
        { name: "MBUX infotainment", category: FeatureCategory.ENTERTAINMENT },
        { name: "Ambient lighting", category: FeatureCategory.COMFORT },
        { name: "Massage seats", category: FeatureCategory.COMFORT },
        { name: "Blind spot assist", category: FeatureCategory.SAFETY },
        { name: "Burmester sound", category: FeatureCategory.ENTERTAINMENT },
      ],
    },
    {
      slug: "tesla-model-3-2024",
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      categoryId: electric.id,
      locationId: airport.id,
      dailyRate: 95,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.ELECTRIC,
      seats: 5,
      doors: 4,
      luggage: 2,
      horsepower: 283,
      color: "Ağ",
      licensePlate: "10-EE-005",
      isPopular: true,
      description:
        "Tesla Model 3 — sürətli elektrik sedan, Autopilot və minimal yanacaq xərci.",
      images: [
        {
          url: "/images/cars/tesla-model-3-1.jpg",
          alt: "Tesla Model 3 front view",
          isPrimary: true,
        },
        {
          url: "/images/cars/tesla-model-3-2.jpg",
          alt: "Tesla Model 3 charging",
        },
      ],
      features: [
        { name: "Autopilot", category: FeatureCategory.SAFETY },
        { name: "Supercharger access", category: FeatureCategory.PERFORMANCE },
        { name: "15\" touchscreen", category: FeatureCategory.ENTERTAINMENT },
        { name: "Over-the-air updates", category: FeatureCategory.PERFORMANCE },
      ],
    },
    {
      slug: "kia-sportage-2023",
      make: "Kia",
      model: "Sportage",
      year: 2023,
      categoryId: suv.id,
      locationId: ganja.id,
      dailyRate: 75,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      seats: 5,
      doors: 5,
      luggage: 3,
      horsepower: 187,
      color: "Qırmızı",
      licensePlate: "20-FF-006",
      isPopular: false,
      description: "Kia Sportage — modern dizayn və geniş bagaj sahəsi.",
      images: [
        {
          url: "/images/cars/kia-sportage-1.jpg",
          alt: "Kia Sportage front view",
          isPrimary: true,
        },
      ],
      features: [
        { name: "Bluetooth", category: FeatureCategory.ENTERTAINMENT },
        { name: "Rear camera", category: FeatureCategory.SAFETY },
        { name: "Heated seats", category: FeatureCategory.COMFORT },
      ],
    },
    {
      slug: "volkswagen-polo-2023",
      make: "Volkswagen",
      model: "Polo",
      year: 2023,
      categoryId: economy.id,
      locationId: sheki.id,
      dailyRate: 35,
      transmission: Transmission.MANUAL,
      fuelType: FuelType.PETROL,
      seats: 5,
      doors: 4,
      luggage: 2,
      horsepower: 95,
      color: "Boz",
      licensePlate: "55-GG-007",
      isPopular: false,
      description: "Volkswagen Polo — kompakt, sərfəli və şəhər üçün ideal.",
      images: [
        {
          url: "/images/cars/vw-polo-1.jpg",
          alt: "Volkswagen Polo front view",
          isPrimary: true,
        },
      ],
      features: [
        { name: "Air conditioning", category: FeatureCategory.COMFORT },
        { name: "USB port", category: FeatureCategory.ENTERTAINMENT },
      ],
    },
    {
      slug: "audi-a6-2024",
      make: "Audi",
      model: "A6",
      year: 2024,
      categoryId: luxury.id,
      locationId: cityCenter.id,
      dailyRate: 140,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.DIESEL,
      seats: 5,
      doors: 4,
      luggage: 3,
      horsepower: 245,
      color: "Qara",
      licensePlate: "10-HH-008",
      isPopular: false,
      description: "Audi A6 — biznes klass sedan, quattro tam ötürücü.",
      images: [
        {
          url: "/images/cars/audi-a6-1.jpg",
          alt: "Audi A6 front view",
          isPrimary: true,
        },
        {
          url: "/images/cars/audi-a6-2.jpg",
          alt: "Audi A6 interior",
        },
      ],
      features: [
        { name: "Virtual cockpit", category: FeatureCategory.ENTERTAINMENT },
        { name: "Quattro AWD", category: FeatureCategory.PERFORMANCE },
        { name: "Matrix LED", category: FeatureCategory.SAFETY },
        { name: "Bang & Olufsen audio", category: FeatureCategory.ENTERTAINMENT },
      ],
    },
  ];

  const cars = [];
  for (const data of carData) {
    const { images, features, ...carFields } = data;
    const car = await prisma.car.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...carFields,
        dailyRate: carFields.dailyRate,
        status: CarStatus.AVAILABLE,
        images: {
          create: images.map((img, idx) => ({
            ...img,
            sortOrder: idx,
          })),
        },
        features: {
          create: features,
        },
      },
    });
    cars.push(car);
  }

  // ─── Add-ons ────────────────────────────────────────────────────────────────
  const addOns = await Promise.all([
    prisma.addOn.upsert({
      where: { slug: "gps-navigation" },
      update: {},
      create: {
        name: "GPS Naviqasiya",
        slug: "gps-navigation",
        description: "Portativ GPS naviqasiya cihazı",
        pricingType: AddOnPricingType.PER_DAY,
        price: 8,
        sortOrder: 1,
      },
    }),
    prisma.addOn.upsert({
      where: { slug: "child-seat" },
      update: {},
      create: {
        name: "Uşaq Oturacağı",
        slug: "child-seat",
        description: "0-4 yaş uşaqlar üçün təhlükəsiz oturacaq",
        pricingType: AddOnPricingType.PER_DAY,
        price: 5,
        sortOrder: 2,
      },
    }),
    prisma.addOn.upsert({
      where: { slug: "full-insurance" },
      update: {},
      create: {
        name: "Tam Sığorta",
        slug: "full-insurance",
        description: "Franşiza olmadan tam sığorta əhatəsi",
        pricingType: AddOnPricingType.PER_DAY,
        price: 15,
        sortOrder: 3,
      },
    }),
    prisma.addOn.upsert({
      where: { slug: "additional-driver" },
      update: {},
      create: {
        name: "Əlavə Sürücü",
        slug: "additional-driver",
        description: "Rezervasiyaya əlavə sürücü daxil edin",
        pricingType: AddOnPricingType.FIXED,
        price: 25,
        sortOrder: 4,
      },
    }),
    prisma.addOn.upsert({
      where: { slug: "wifi-hotspot" },
      update: {},
      create: {
        name: "Wi-Fi Hotspot",
        slug: "wifi-hotspot",
        description: "Mobil internet cihazı",
        pricingType: AddOnPricingType.PER_DAY,
        price: 10,
        sortOrder: 5,
      },
    }),
  ]);

  // ─── Sample Booking ─────────────────────────────────────────────────────────
  const camry = cars.find((c) => c.slug === "toyota-camry-2023")!;
  const pickupDate = new Date();
  pickupDate.setDate(pickupDate.getDate() + 7);
  pickupDate.setHours(10, 0, 0, 0);

  const returnDate = new Date(pickupDate);
  returnDate.setDate(returnDate.getDate() + 5);
  returnDate.setHours(10, 0, 0, 0);

  const rentalDays = 5;
  const dailyRate = 65;
  const subtotal = dailyRate * rentalDays;
  const gpsAddOn = addOns[0];
  const insuranceAddOn = addOns[2];
  const addOnsTotal = 8 * rentalDays + 15 * rentalDays;
  const taxAmount = Math.round((subtotal + addOnsTotal) * 0.18 * 100) / 100;
  const totalAmount = subtotal + addOnsTotal + taxAmount;

  const existingBooking = await prisma.booking.findUnique({
    where: { bookingNumber: "RC-2024-00001" },
  });

  if (!existingBooking) {
    await prisma.booking.create({
      data: {
        bookingNumber: "RC-2024-00001",
        userId: customer.id,
        carId: camry.id,
        pickupLocationId: cityCenter.id,
        returnLocationId: airport.id,
        pickupDate,
        returnDate,
        status: BookingStatus.CONFIRMED,
        dailyRate,
        rentalDays,
        subtotal,
        addOnsTotal,
        taxRate: 0.18,
        taxAmount,
        totalAmount,
        addOns: {
          create: [
            {
              addOnId: gpsAddOn.id,
              quantity: 1,
              unitPrice: 8,
              totalPrice: 8 * rentalDays,
            },
            {
              addOnId: insuranceAddOn.id,
              quantity: 1,
              unitPrice: 15,
              totalPrice: 15 * rentalDays,
            },
          ],
        },
        payment: {
          create: {
            amount: totalAmount,
            status: PaymentStatus.COMPLETED,
            method: PaymentMethod.CREDIT_CARD,
            transactionId: "txn_seed_001",
            paidAt: new Date(),
          },
        },
      },
    });
  }

  console.log("Seed completed:");
  console.log(`  Users: 2`);
  console.log(`  Locations: ${locations.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Cars: ${cars.length}`);
  console.log(`  Add-ons: ${addOns.length}`);
  console.log(`  Sample booking: RC-2024-00001`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
