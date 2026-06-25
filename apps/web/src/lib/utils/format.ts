export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("az-AZ")} ₼`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function calculateDays(pickup: string, returnDate: string): number {
  if (!pickup || !returnDate) return 1;
  const start = new Date(pickup + "T00:00:00");
  const end = new Date(returnDate + "T00:00:00");
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

export function getDefaultDates(): { pickup: string; returnDate: string } {
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + 1);
  const returnDate = new Date(pickup);
  returnDate.setDate(returnDate.getDate() + 3);
  return {
    pickup: pickup.toISOString().split("T")[0],
    returnDate: returnDate.toISOString().split("T")[0],
  };
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
