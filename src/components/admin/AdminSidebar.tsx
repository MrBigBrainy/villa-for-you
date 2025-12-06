"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, Home, Bell } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [webName, setWebName] = useState("Villa");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "setting", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWebName(docSnap.data().webName || "Villa");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 h-screen fixed left-0 top-0 flex flex-col z-50 overflow-y-auto">
      <div className="p-8 border-b border-zinc-100">
        <h1 className="text-2xl font-serif text-zinc-900">{webName}</h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Admin Panel</p>
      </div>

      <nav className="p-4 space-y-2">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin")
              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Residences</span>
        </Link>

        <Link
          href="/admin/notifications"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin/notifications")
              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
        </Link>

        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin/settings")
              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-zinc-100 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">View Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
