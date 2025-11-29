"use client";

import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-zinc-950 text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-serif">{settings.webName}</div>
        <div className="text-zinc-500 text-sm">
          © {new Date().getFullYear()} {settings.webName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
