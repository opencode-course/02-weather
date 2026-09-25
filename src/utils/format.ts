import type { GeoLocation } from "../types/City";
import type { Units } from "../types/Weather";

export function formatUnits(units: Units): string {
  return units === "celsius" ? "°C" : "°F";
}

export function formatLocation(location: GeoLocation): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(", ");
}

export function formatDay(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
