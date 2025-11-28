"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="bg-white p-8 border border-zinc-200 w-full max-w-md">
        <h1 className="text-2xl font-serif mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-2 hover:bg-zinc-800 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Need an account? <Link href="/register" className="text-zinc-900 underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
