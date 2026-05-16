import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japan Trip Companion",
    short_name: "Japan Trip",
    description: "Personal Japan trip companion — itinerary, maps, reservations. Offline-first.",
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#3949AB",
    orientation: "portrait-primary",
    categories: ["travel", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Today",
        short_name: "Today",
        url: "/",
        description: "See today's itinerary",
      },
      {
        name: "Itinerary",
        short_name: "Itinerary",
        url: "/itinerary",
        description: "Full 21-day itinerary",
      },
      {
        name: "Map",
        short_name: "Map",
        url: "/map",
        description: "Interactive trip map",
      },
      {
        name: "Reservations",
        short_name: "Reservations",
        url: "/reservations",
        description: "Bookings and confirmations",
      },
    ],
  };
}
