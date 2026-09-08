import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q&A Search",
  description: "Search your complete question bank instantly."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
