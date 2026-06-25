export type CarCategory = "economy" | "compact" | "suv" | "premium" | "electric";

export type Transmission = "automatic" | "manual";

export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";

export interface CarSpecs {
  seats: number;
  doors: number;
  transmission: Transmission;
  fuel: FuelType;
  luggage: number;
  horsepower: number;
  acceleration: string;
  consumption: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  available: boolean;
  location: string;
  specs: CarSpecs;
  features: string[];
  description: string;
}

export interface SearchParams {
  location: string;
  pickupDate: string;
  returnDate: string;
  category: CarCategory | "all";
}

export interface BookingAddon {
  id: string;
  name: string;
  pricePerDay: number;
  description: string;
}

export interface BookingState {
  carId: string | null;
  pickupDate: string;
  returnDate: string;
  location: string;
  addons: string[];
  step: number;
}

export interface Reservation {
  id: string;
  carId: string;
  carName: string;
  carImage: string;
  pickupDate: string;
  returnDate: string;
  location: string;
  totalPrice: number;
  status: "confirmed" | "completed" | "cancelled";
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
}

export type SortOption = "price-asc" | "price-desc" | "rating" | "name";

export interface FleetFilters {
  categories: CarCategory[];
  priceMin: number;
  priceMax: number;
  transmission: Transmission[];
  fuel: FuelType[];
  seatsMin: number;
}
