import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "দক্ষ হাত | নির্ভরযোগ্য মিস্ত্রি খুঁজুন",
  description: "বাংলাদেশে দক্ষ ও অনুমোদিত মিস্ত্রি খুঁজুন — দক্ষ হাত।",
  applicationName: "দক্ষ হাত",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "দক্ষ হাত" }
};
export const viewport: Viewport = {
  themeColor: "#0b5b45",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bn"><body>{children}<script dangerouslySetInnerHTML={{__html: `
    if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  `}} /></body></html>;
}
