import FleetBookingShell from "@/components/layout/FleetBookingShell";
import { FleetGridSkeleton } from "@/components/ui/LoadingSkeleton";

export default function FleetLoading() {
  return (
    <FleetBookingShell>
      <FleetGridSkeleton count={6} />
    </FleetBookingShell>
  );
}
