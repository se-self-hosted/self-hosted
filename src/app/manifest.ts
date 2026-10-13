import type { MetadataRoute } from "next";

// Lets the app be installed to the home screen / desktop (PWA).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MeetSync — Voice Meeting Platform",
    short_name: "MeetSync",
    description: "ประชุมด้วยเสียงแบบเรียลไทม์ผ่านเบราว์เซอร์ พร้อมถอดเสียงและสรุปการประชุม",
    id: "/",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f4f2ec",
    theme_color: "#f4f2ec",
    lang: "th",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
