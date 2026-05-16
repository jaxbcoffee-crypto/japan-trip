import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { SkipLink, Header, BottomNav } from "@/components/shell";
import { CommandPaletteWrapper } from "@/components/ui/CommandPaletteWrapper";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Japan Trip Companion",
    template: "%s · Japan Trip",
  },
  description: "Personal Japan trip companion — itinerary, maps, reservations. Offline-first.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Japan Trip",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)",  color: "#0D0D0D" },
  ],
};

// Hardcoded FOUC-prevention script — no user data, XSS-safe
const themeScript = `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.setAttribute('data-theme',s||(d?'dark':'light'));})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} ${notoSerifJP.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased bg-bg text-fg">
        <SkipLink />
        <Header />
        <main id="main-content" className="pb-16 md:pb-0">
          {children}
        </main>
        <BottomNav />
        <CommandPaletteWrapper />
      </body>
    </html>
  );
}
