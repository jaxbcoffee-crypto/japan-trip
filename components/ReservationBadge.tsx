import { CheckCircle, AlertCircle, LogIn } from "lucide-react";
import type { Stop } from "@/lib/types";

type Status = "booked" | "action-needed" | "walk-in";

function getStatus(stop: Stop): Status | null {
  if (!stop.reservation) return null;
  if (stop.reservation.booked) return "booked";
  if (stop.reservation.required) return "action-needed";
  return "walk-in";
}

export function ReservationBadge({ stop }: { stop: Stop }) {
  const status = getStatus(stop);
  if (!status) return null;

  if (status === "booked") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
        <CheckCircle size={11} aria-hidden />
        Booked
      </span>
    );
  }

  if (status === "action-needed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
        <AlertCircle size={11} aria-hidden />
        Book required
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
      <LogIn size={11} aria-hidden />
      Walk-in
    </span>
  );
}
