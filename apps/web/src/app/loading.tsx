import { HomeHeroSkeleton, FleetGridSkeleton } from "@/components/ui/LoadingSkeleton";
import FleetBookingShell from "@/components/layout/FleetBookingShell";

export default function HomeLoading() {
  return (
    <FleetBookingShell>
      <HomeHeroSkeleton />
      <FleetGridSkeleton count={3} />
    </FleetBookingShell>
  );
}
