import landmarksData from "@/data/landmarks.json";
import creditsData from "@/public/landmarks/credits.json";

export interface LandmarkInfo {
  dayIndex: number;
  date: string;
  city: string;
  landmark: string;
  altText: string;
  attribution: string;
  license: string;
  dominantHue: string;
  srcSet: {
    avif: string;
    webp: string;
    jpg: string;
  };
  src: string; // fallback jpg 1280
}

interface CreditEntry {
  dayIndex: number;
  dominantHue?: string;
  attribution?: string;
}

interface CreditsFile {
  days?: CreditEntry[];
}

const creditsMap: Record<number, CreditEntry> = {};
const credits = creditsData as CreditsFile;
if (credits?.days && Array.isArray(credits.days)) {
  for (const entry of credits.days) {
    creditsMap[entry.dayIndex] = entry;
  }
}

export function landmarkForDay(dayIndex: number): LandmarkInfo | null {
  const data = landmarksData.days.find((d) => d.dayIndex === dayIndex);
  if (!data) return null;
  const nn = String(dayIndex).padStart(2, "0");
  const credit: CreditEntry = creditsMap[dayIndex] ?? { dayIndex };
  return {
    ...data,
    attribution: credit.attribution ?? data.photographer,
    dominantHue: credit.dominantHue ?? "#3949AB",
    srcSet: {
      avif: `/landmarks/day${nn}-1920.avif 1920w, /landmarks/day${nn}-1280.avif 1280w, /landmarks/day${nn}-640.avif 640w`,
      webp: `/landmarks/day${nn}-1920.webp 1920w, /landmarks/day${nn}-1280.webp 1280w, /landmarks/day${nn}-640.webp 640w`,
      jpg: `/landmarks/day${nn}-1920.jpg 1920w, /landmarks/day${nn}-1280.jpg 1280w, /landmarks/day${nn}-640.jpg 640w`,
    },
    src: `/landmarks/day${nn}-1280.jpg`,
  };
}

/** CSS gradient fallback for a city when photo is unavailable */
export function cityGradient(city: string): string {
  const gradients: Record<string, string> = {
    Tokyo:
      "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #7986cb 100%)",
    Kyoto:
      "linear-gradient(135deg, #880e4f 0%, #c2185b 50%, #e8b4bc 100%)",
    Osaka:
      "linear-gradient(135deg, #e65100 0%, #f57c00 50%, #ffb74d 100%)",
    Nara:
      "linear-gradient(135deg, #1b5e20 0%, #388e3c 50%, #81c784 100%)",
    Nikko:
      "linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #ce93d8 100%)",
    Kamakura:
      "linear-gradient(135deg, #006064 0%, #0097a7 50%, #80deea 100%)",
    Himeji:
      "linear-gradient(135deg, #37474f 0%, #607d8b 50%, #b0bec5 100%)",
    Miyajima:
      "linear-gradient(135deg, #b71c1c 0%, #d32f2f 50%, #ef9a9a 100%)",
    Kobe:
      "linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #90caf9 100%)",
  };
  return gradients[city] ?? gradients["Tokyo"] ?? "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #7986cb 100%)";
}
