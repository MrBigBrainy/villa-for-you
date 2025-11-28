"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [lineConnected, setLineConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleConnect = async () => {
    setLoading(true);
    toast.loading("Connecting to Google...");
    
    // Simulate OAuth connection
    setTimeout(() => {
      setGoogleConnected(true);
      toast.dismiss();
      toast.success("Successfully connected to Google!");
      setLoading(false);
    }, 2000);
  };

  const handleLineConnect = async () => {
    setLoading(true);
    toast.loading("Connecting to LINE...");
    
    // Simulate OAuth connection
    setTimeout(() => {
      setLineConnected(true);
      toast.dismiss();
      toast.success("Successfully connected to LINE!");
      setLoading(false);
    }, 2000);
  };

  const handleDisconnect = (service: string) => {
    if (service === "google") {
      setGoogleConnected(false);
      toast.success("Disconnected from Google");
    } else {
      setLineConnected(false);
      toast.success("Disconnected from LINE");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Toaster position="top-right" />
      
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm hover:text-zinc-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <h1 className="text-2xl font-serif mb-8">Settings</h1>

        <div className="bg-white border border-zinc-200 p-8">
          <h2 className="text-xl font-serif mb-6">OAuth Integrations</h2>
          <p className="text-sm text-zinc-600 mb-8">
            Connect your account with Google and LINE (Thailand) for enhanced authentication and social features.
          </p>

          <div className="space-y-6">
            {/* Google Integration */}
            <div className="border border-zinc-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-zinc-200 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Google</h3>
                    <p className="text-sm text-zinc-500">Connect with your Google account</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {googleConnected ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                      <button
                        onClick={() => handleDisconnect("google")}
                        className="px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleGoogleConnect}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* LINE Integration */}
            <div className="border border-zinc-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00B900] flex items-center justify-center">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">LINE</h3>
                    <p className="text-sm text-zinc-500">Connect with your LINE account (Thailand)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {lineConnected ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                      <button
                        onClick={() => handleDisconnect("line")}
                        className="px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleLineConnect}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-[#00B900] text-white hover:bg-[#00A000] transition-colors disabled:opacity-50"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">OAuth Integration Info</h4>
                <p className="text-sm text-blue-700">
                  These integrations are currently in demo mode. In production, you would configure OAuth credentials in your Firebase console and implement the actual OAuth flow. For LINE, you would need to register your app in the LINE Developers console.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
