"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, LogOut, Home, Bell, Loader2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import Image from "next/image";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    connectedAccounts,
    loading,
    connectGoogle,
    disconnectGoogle,
    connectLine,
    disconnectLine,
  } = useConnectedAccounts();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleConnectGoogle = async () => {
    const result = await connectGoogle();
    if (result?.success) {
      console.log("Google connected successfully");
    } else {
      console.error("Failed to connect Google:", result?.error);
    }
  };

  const handleDisconnectGoogle = async () => {
    const result = await disconnectGoogle();
    if (result?.success) {
      console.log("Google disconnected successfully");
    }
  };

  const handleConnectLine = async () => {
    const result = await connectLine();
    if (result?.success) {
      console.log(result.message);
    }
  };

  const handleDisconnectLine = async () => {
    const result = await disconnectLine();
    if (result?.success) {
      console.log("LINE disconnected successfully");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 h-screen fixed left-0 top-0 flex flex-col z-50 overflow-y-auto">
      <div className="p-8 border-b border-zinc-100">
        <h1 className="text-2xl font-serif text-zinc-900">Villa Pik</h1>
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

      {/* Notification Section */}
      <div className="p-4 border-t border-zinc-100">
        <div className="flex items-center gap-2 mb-3 px-2">
          <Bell className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Notifications
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Google Account */}
            <div className="bg-zinc-50 rounded-xl p-3 transition-all duration-200 hover:bg-zinc-100">
              {connectedAccounts.google ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {connectedAccounts.google.photoUrl ? (
                      <Image
                        src={connectedAccounts.google.photoUrl}
                        alt={connectedAccounts.google.displayName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-red-600">G</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-900 truncate">
                        {connectedAccounts.google.displayName}
                      </p>
                      <p className="text-[10px] text-zinc-500">Google</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectGoogle}
                    className="w-full text-xs px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">G</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-700">Connect Google</span>
                </button>
              )}
            </div>

            {/* LINE Account */}
            <div className="bg-zinc-50 rounded-xl p-3 transition-all duration-200 hover:bg-zinc-100">
              {connectedAccounts.line ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {connectedAccounts.line.photoUrl ? (
                      <Image
                        src={connectedAccounts.line.photoUrl}
                        alt={connectedAccounts.line.displayName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-green-600">L</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-900 truncate">
                        {connectedAccounts.line.displayName}
                      </p>
                      <p className="text-[10px] text-zinc-500">LINE</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectLine}
                    className="w-full text-xs px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectLine}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-6 h-6 bg-[#06C755] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">L</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-700">Connect LINE</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
