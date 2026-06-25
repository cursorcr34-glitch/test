import { District, Locale } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface LocalizedDistrict {
  id: District;
  slug: string;
  nameAz: string;
  nameEn: string;
  nameRu: string;
  city: string;
}

export const DISTRICTS: LocalizedDistrict[] = [
  {
    id: 'NARIMANOV',
    slug: 'narimanov',
    nameAz: 'Nərimanov',
    nameEn: 'Narimanov',
    nameRu: 'Нарimanов',
    city: 'Baku',
  },
  {
    id: 'YASAMAL',
    slug: 'yasamal',
    nameAz: 'Yasamal',
    nameEn: 'Yasamal',
    nameRu: 'Ясамаль',
    city: 'Baku',
  },
  {
    id: 'XETAI',
    slug: 'xetai',
    nameAz: 'Xətai',
    nameEn: 'Khatai',
    nameRu: 'Хатаи',
    city: 'Baku',
  },
  {
    id: 'SEBAIL',
    slug: 'sebail',
    nameAz: 'Səbail',
    nameEn: 'Sabail',
    nameRu: 'Сабаил',
    city: 'Baku',
  },
  {
    id: 'BADAMDAR',
    slug: 'badamdar',
    nameAz: 'Badamdar',
    nameEn: 'Badamdar',
    nameRu: 'Бадамдар',
    city: 'Baku',
  },
  {
    id: 'GENCE',
    slug: 'gence',
    nameAz: 'Gəncə',
    nameEn: 'Ganja',
    nameRu: 'Гянджа',
    city: 'Ganja',
  },
];

export function getDistrictName(district: District, locale: Locale = 'AZ'): string {
  const found = DISTRICTS.find((d) => d.id === district);
  if (!found) return district;
  switch (locale) {
    case 'EN':
      return found.nameEn;
    case 'RU':
      return found.nameRu;
    default:
      return found.nameAz;
  }
}

export function localizeProperty<T extends {
  titleAz: string;
  titleEn: string;
  titleRu: string;
  descriptionAz: string;
  descriptionEn: string;
  descriptionRu: string;
  district: District;
  price?: unknown;
}>(property: T, locale: Locale = 'AZ') {
  const titleKey = locale === 'EN' ? 'titleEn' : locale === 'RU' ? 'titleRu' : 'titleAz';
  const descKey = locale === 'EN' ? 'descriptionEn' : locale === 'RU' ? 'descriptionRu' : 'descriptionAz';

  return {
    ...property,
    title: property[titleKey],
    description: property[descKey],
    districtName: getDistrictName(property.district, locale),
    priceFormatted: `${Number(property.price ?? 0).toLocaleString('az-AZ')} ₼`,
  };
}
