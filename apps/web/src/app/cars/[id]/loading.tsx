import FleetBookingShell from "@/components/layout/FleetBookingShell";
import { CarDetailSkeleton } from "@/components/ui/LoadingSkeleton";

export default function CarDetailLoading() {
  return (
    <FleetBookingShell>
      <CarDetailSkeleton />
    </FleetBookingShell>
  );
}
