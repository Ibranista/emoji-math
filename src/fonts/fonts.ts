import { Inter, Quicksand, Urbanist, Wendy_One } from "next/font/google";

export const base_font = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-base",
  display: "swap",
});

export const wendy_one_font = Wendy_One({
  variable: "--font-wendy-one",
  subsets: ["latin"],
  weight: "400",
});

export const quick_sand_font = Quicksand({
  variable: "--font-quick-sand",
  subsets: ["latin"],
  display: "swap",
});

export const urbanist_font = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});
