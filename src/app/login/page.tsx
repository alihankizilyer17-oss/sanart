"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Giriş başarılı!");

      router.push("/");
    } catch (error: any) {
      alert("Giriş başarısız: " + error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-10 shadow-2xl">

        <h1 className="text-center text-4xl font-bold text-white">
          Giriş Yap
        </h1>

        <p className="mt-2 text-center text-zinc-400">
          SanArt hesabınıza giriş yapın.
        </p>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-8 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none"
        />

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-xl bg-white py-3 font-bold text-black hover:bg-zinc-200"
        >
          Giriş Yap
        </button>

      </div>
    </main>
  );
}