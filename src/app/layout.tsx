import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const themeInitScript = `
  try {
    var savedTheme = localStorage.getItem("theme");
    document.documentElement.dataset.theme = savedTheme === "dark" ? "dark" : "light";
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
`;

const plexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "thai"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetSync",
  description: "Web-based Real-time Voice Meeting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${plexSansThai.variable} ${bricolage.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
