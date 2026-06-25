"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";
import FleetBookingShell from "@/components/layout/FleetBookingShell";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FleetBookingShell showJourney={false}>
      <ErrorState
        title="Gözlənilməz xəta"
        message="Sistemdə problem yarandı. Zəhmət olmasa yenidən cəhd edin."
        onRetry={reset}
      />
    </FleetBookingShell>
  );
}
