export function decimalToNumber(value: { toNumber?: () => number } | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  return Number(value);
}

export function calculateRentalDays(pickupDate: Date, returnDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / msPerDay);
  return Math.max(days, 1);
}

export async function generateBookingNumber(
  prisma: { booking: { count: (args?: object) => Promise<number> } },
): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.booking.count({
    where: {
      bookingNumber: { startsWith: `RC-${year}-` },
    },
  });
  return `RC-${year}-${String(count + 1).padStart(5, '0')}`;
}

export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
