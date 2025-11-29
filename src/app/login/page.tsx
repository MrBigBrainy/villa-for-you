"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | "none">("none");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 90 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white p-8 rounded-2xl shadow-2xl border border-zinc-100 w-full max-w-md relative"
      >
       

        <h1 className="text-3xl font-serif mb-8 text-center mt-8">Welcome Back</h1>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded-lg"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput("none")}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="admin@villapik.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-zinc-500 font-medium ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput("none")}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-4 rounded-xl font-medium tracking-wide hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-zinc-900/20"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          New to Villa Pik?{" "}
          <Link href="/register" className="text-zinc-900 font-medium hover:underline decoration-2 underline-offset-4">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
