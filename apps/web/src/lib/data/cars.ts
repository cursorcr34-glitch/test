import type { BookingAddon, Car, Reservation, UserProfile } from "@/lib/types/car";

export const LOCATIONS = [
  "Bakı Hava Limanı",
  "28 May",
  "Nizami",
  "Gənclik",
  "Sumqayıt",
  "Gəncə",
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  all: "Hamısı",
  economy: "Ekonom",
  compact: "Kompakt",
  suv: "SUV",
  premium: "Premium",
  electric: "Elektrik",
};

export const cars: Car[] = [
  {
    id: "bmw-530i",
    name: "BMW 530i M Sport",
    brand: "BMW",
    model: "530i",
    year: 2024,
    category: "premium",
    pricePerDay: 185,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 128,
    available: true,
    location: "Bakı Hava Limanı",
    specs: {
      seats: 5,
      doors: 4,
      transmission: "automatic",
      fuel: "petrol",
      luggage: 3,
      horsepower: 252,
      acceleration: "6.1s",
      consumption: "7.2L/100km",
    },
    features: ["Apple CarPlay", "Adaptive Cruise", "Panoramik dam", "Isitməli oturacaqlar", "360° kamera"],
    description:
      "Premium biznes sedanı — sürət, komfort və texnologiyanın ideal birləşməsi. Uzun yol səfərləri və şəhər içi sürüş üçün mükəmməl seçim.",
  },
  {
    id: "mercedes-glc",
    name: "Mercedes-Benz GLC 300",
    brand: "Mercedes-Benz",
    model: "GLC 300",
    year: 2024,
    category: "suv",
    pricePerDay: 165,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
      "https://images.unsplash.com/photo-1519641471654-76cead7a5e40?w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 94,
    available: true,
    location: "28 May",
    specs: {
      seats: 5,
      doors: 5,
      transmission: "automatic",
      fuel: "petrol",
      luggage: 4,
      horsepower: 258,
      acceleration: "6.2s",
      consumption: "8.1L/100km",
    },
    features: ["MBUX", "Off-road rejimi", "Elektrik baqaj", "Ambient işıqlandırma", "Blind Spot Assist"],
    description:
      "Elegant SUV — şəhər və kənd yollarında eyni rahatlıq. Geniş salon və yüksək oturma mövqeyi ailə səfərləri üçün idealdır.",
  },
  {
    id: "tesla-model-3",
    name: "Tesla Model 3 Long Range",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    category: "electric",
    pricePerDay: 145,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
      "https://images.unsplash.com/photo-1620891549029-9a066a976fc5?w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 156,
    available: true,
    location: "Nizami",
    specs: {
      seats: 5,
      doors: 4,
      transmission: "automatic",
      fuel: "electric",
      luggage: 2,
      horsepower: 346,
      acceleration: "4.4s",
      consumption: "14.9 kWh/100km",
    },
    features: ["Autopilot", "Supercharger", "15\" ekran", "Glass Roof", "Premium audio"],
    description:
      "Elektrikli performans lideri — səssiz sürüş, ani sürətlənmə və aşağı əməliyyat xərcləri. Ekoloji və dinamik sürüş təcrübəsi.",
  },
  {
    id: "toyota-corolla",
    name: "Toyota Corolla Hybrid",
    brand: "Toyota",
    model: "Corolla",
    year: 2023,
    category: "compact",
    pricePerDay: 55,
    image: "https://images.unsplash.com/photo-1621007947382-b6763a24ec67?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1621007947382-b6763a24ec67?w=1200&q=80",
      "https://images.unsplash.com/photo-1590362891991-f776e7475882?w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-15e425ed5930?w=1200&q=80",
    ],
    rating: 4.6,
    reviewCount: 203,
    available: true,
    location: "Gənclik",
    specs: {
      seats: 5,
      doors: 4,
      transmission: "automatic",
      fuel: "hybrid",
      luggage: 2,
      horsepower: 122,
      acceleration: "10.5s",
      consumption: "4.5L/100km",
    },
    features: ["Toyota Safety Sense", "Hybrid sistem", "Bluetooth", "Klima", "USB-C"],
    description:
      "Etibarlı kompakt sedan — şəhər trafikində sərfəli və rahat. Hibrid mühərrik ilə yanacaq xərclərini minimuma endirin.",
  },
  {
    id: "hyundai-i20",
    name: "Hyundai i20",
    brand: "Hyundai",
    model: "i20",
    year: 2023,
    category: "economy",
    pricePerDay: 35,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293bb4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293bb4?w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494451f?w=1200&q=80",
    ],
    rating: 4.4,
    reviewCount: 87,
    available: true,
    location: "Sumqayıt",
    specs: {
      seats: 5,
      doors: 5,
      transmission: "manual",
      fuel: "petrol",
      luggage: 1,
      horsepower: 84,
      acceleration: "12.8s",
      consumption: "5.8L/100km",
    },
    features: ["Klima", "Bluetooth", "ABS", "Airbag", "Elektrik pəncərələr"],
    description:
      "Büdcə dostu şəhər avtomobili — parkinq və qısa məsafəli səfərlər üçün ideal. Aşağı qiymət, praktik ölçülər.",
  },
  {
    id: "range-rover-sport",
    name: "Range Rover Sport",
    brand: "Land Rover",
    model: "Sport",
    year: 2024,
    category: "suv",
    pricePerDay: 220,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
      "https://images.unsplash.com/photo-1519641471654-76cead7a5e40?w=1200&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 67,
    available: true,
    location: "Bakı Hava Limanı",
    specs: {
      seats: 5,
      doors: 5,
      transmission: "automatic",
      fuel: "diesel",
      luggage: 5,
      horsepower: 300,
      acceleration: "6.0s",
      consumption: "7.8L/100km",
    },
    features: ["Terrain Response", "Air Suspension", "Meridian Audio", "Head-up Display", "Massage seats"],
    description:
      "Lüks off-road SUV — hər yol şəraitində üstün performans. Premium interyer və qabaqcıl off-road texnologiyaları.",
  },
  {
    id: "audi-a4",
    name: "Audi A4 Quattro",
    brand: "Audi",
    model: "A4",
    year: 2023,
    category: "premium",
    pricePerDay: 120,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 112,
    available: true,
    location: "28 May",
    specs: {
      seats: 5,
      doors: 4,
      transmission: "automatic",
      fuel: "petrol",
      luggage: 3,
      horsepower: 190,
      acceleration: "7.3s",
      consumption: "6.8L/100km",
    },
    features: ["Virtual Cockpit", "Quattro AWD", "Matrix LED", "Bang & Olufsen", "Lane Assist"],
    description:
      "Alman mühəndisliyi və dördtəkərli sürüş — hava şəraitindən asılı olmayan sabit yol tutuşu. İş səfərləri üçün mükəmməl.",
  },
  {
    id: "kia-niro-ev",
    name: "Kia Niro EV",
    brand: "Kia",
    model: "Niro EV",
    year: 2024,
    category: "electric",
    pricePerDay: 95,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80",
      "https://images.unsplash.com/photo-1620891549029-9a066a976fc5?w=1200&q=80",
    ],
    rating: 4.5,
    reviewCount: 45,
    available: true,
    location: "Gəncə",
    specs: {
      seats: 5,
      doors: 5,
      transmission: "automatic",
      fuel: "electric",
      luggage: 3,
      horsepower: 204,
      acceleration: "7.8s",
      consumption: "16.2 kWh/100km",
    },
    features: ["450km menzil", "V2L", "Smart Cruise", "Wireless CarPlay", "Regenerative braking"],
    description:
      "Praktik elektrik crossover — geniş salon, uzun menzil və aşağı əməliyyat xərcləri. Şəhər və kənd yolları üçün ideal.",
  },
];

export const bookingAddons: BookingAddon[] = [
  {
    id: "gps",
    name: "GPS Naviqasiya",
    pricePerDay: 8,
    description: "Real vaxt trafik məlumatı ilə naviqasiya sistemi",
  },
  {
    id: "child-seat",
    name: "Uşaq oturacağı",
    pricePerDay: 12,
    description: "0-4 yaş qrupu üçün ISO FIX oturacaq",
  },
  {
    id: "extra-driver",
    name: "Əlavə sürücü",
    pricePerDay: 15,
    description: "İkinci sürücü üçün tam sığorta əhatəsi",
  },
  {
    id: "full-insurance",
    name: "Tam Sığorta (CDW+)",
    pricePerDay: 25,
    description: "Franşiza olmadan tam zərər əhatəsi",
  },
  {
    id: "wifi",
    name: "Mobil WiFi",
    pricePerDay: 10,
    description: "Limitsiz 4G internet hotspot cihazı",
  },
];

export const mockReservations: Reservation[] = [
  {
    id: "res-001",
    carId: "bmw-530i",
    carName: "BMW 530i M Sport",
    carImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
    pickupDate: "2025-07-01",
    returnDate: "2025-07-05",
    location: "Bakı Hava Limanı",
    totalPrice: 740,
    status: "confirmed",
  },
  {
    id: "res-002",
    carId: "toyota-corolla",
    carName: "Toyota Corolla Hybrid",
    carImage: "https://images.unsplash.com/photo-1621007947382-b6763a24ec67?w=400&q=80",
    pickupDate: "2025-06-10",
    returnDate: "2025-06-12",
    location: "Gənclik",
    totalPrice: 110,
    status: "completed",
  },
];

export const mockProfile: UserProfile = {
  name: "Kamran Məmmədov",
  email: "kamran@example.az",
  phone: "+994 50 123 45 67",
  licenseNumber: "AZ-1234567",
};

export function getCarById(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}

export function getPopularCars(limit = 6): Car[] {
  return [...cars].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export async function fetchCars(): Promise<Car[]> {
  await new Promise((r) => setTimeout(r, 300));
  return cars;
}

export async function fetchCarById(id: string): Promise<Car | null> {
  await new Promise((r) => setTimeout(r, 200));
  return getCarById(id) ?? null;
}
