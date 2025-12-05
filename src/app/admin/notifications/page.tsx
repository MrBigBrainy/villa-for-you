"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import { Loader2, Bell } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import SendMailTest from "@/components/sendMailTest"

export default function AdminNotifications() {
  const {
    connectedAccounts,
    loading,
    connectGoogle,
    disconnectGoogle,
    connectLine,
    disconnectLine,
  } = useConnectedAccounts();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-zinc-900 mb-2">Notifications</h1>
            <p className="text-zinc-500">Manage your connected accounts for notifications</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-zinc-900 border-b border-zinc-100 pb-4">
                Connected Accounts
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Google Account */}
                <div className="bg-zinc-50 rounded-xl p-6 transition-all duration-200 hover:bg-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {connectedAccounts.google ? (
                      <>
                        {connectedAccounts.google.photoUrl ? (
                          <Image
                            src={connectedAccounts.google.photoUrl}
                            alt={connectedAccounts.google.displayName}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-red-600">G</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-zinc-900">
                            {connectedAccounts.google.displayName}
                          </p>
                          <p className="text-sm text-zinc-500">Google Account</p>
                        </div>
                      </>
                    ) : (
                      <>
                         <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-red-600">G</span>
                          </div>
                        <div>
                          <p className="font-medium text-zinc-900">Google</p>
                          <p className="text-sm text-zinc-500">Not connected</p>
                        </div>
                      </>
                    )}
                  </div>

                  {connectedAccounts.google ? (
                    <button
                      onClick={handleDisconnectGoogle}
                      className="px-4 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors text-sm font-medium"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={handleConnectGoogle}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Connect Google
                    </button>
                  )}
                </div>

                {/* LINE Account */}
                <div className="bg-zinc-50 rounded-xl p-6 transition-all duration-200 hover:bg-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {connectedAccounts.line ? (
                      <>
                        {connectedAccounts.line.photoUrl ? (
                          <Image
                            src={connectedAccounts.line.photoUrl}
                            alt={connectedAccounts.line.displayName}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-green-600">L</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-zinc-900">
                            {connectedAccounts.line.displayName}
                          </p>
                          <p className="text-sm text-zinc-500">LINE Account</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold text-green-600">L</span>
                          </div>
                        <div>
                          <p className="font-medium text-zinc-900">LINE</p>
                          <p className="text-sm text-zinc-500">Not connected</p>
                        </div>
                      </>
                    )}
                  </div>

                  {connectedAccounts.line ? (
                    <button
                      onClick={handleDisconnectLine}
                      className="px-4 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors text-sm font-medium"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={handleConnectLine}
                      className="px-4 py-2 bg-[#06C755] text-white rounded-lg hover:bg-[#05b34c] transition-colors text-sm font-medium"
                    >
                      Connect LINE
                    </button>
                  )}
                </div>
              </div>
              <SendMailTest/>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
