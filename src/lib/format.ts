import type { District, Locale, Property } from '@/types';
import { getDistrictName } from './i18n';

export function formatPrice(price: number | string, listingType?: 'SALE' | 'RENT', perMonthLabel = '/ay'): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  const formatted = num.toLocaleString('az-AZ', { maximumFractionDigits: 0 });
  const suffix = listingType === 'RENT' ? ` ${perMonthLabel}` : '';
  return `${formatted} ₼${suffix}`;
}

export function localizeProperty(property: Property, locale: Locale): Property {
  const titleKey = locale === 'EN' ? 'titleEn' : locale === 'RU' ? 'titleRu' : 'titleAz';
  const descKey = locale === 'EN' ? 'descriptionEn' : locale === 'RU' ? 'descriptionRu' : 'descriptionAz';

  return {
    ...property,
    title: property[titleKey],
    description: property[descKey],
    districtName: getDistrictName(property.district, locale),
    priceFormatted: formatPrice(property.price, property.listingType),
  };
}

export function getDistrictSlug(district: District): string {
  const slugs: Record<District, string> = {
    NARIMANOV: 'narimanov',
    YASAMAL: 'yasamal',
    XETAI: 'xetai',
    SEBAIL: 'sebail',
    BADAMDAR: 'badamdar',
    GENCE: 'gence',
  };
  return slugs[district];
}
