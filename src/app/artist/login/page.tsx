"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArtistLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert("Giriş başarısız: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-8 shadow-2xl md:p-10">

        <div className="mb-6 text-4xl">
          🎨
        </div>

        <h1 className="text-3xl font-bold text-white">
          Sanatçı Girişi
        </h1>

        <p className="mt-3 text-zinc-400">
          Sanatçı panelinize erişmek için giriş yapın.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-white"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-white py-3 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Giriş Yapılıyor..." : "Sanatçı Girişi Yap"}
        </button>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-700" />

          <span className="text-sm text-zinc-500">
            veya
          </span>

          <div className="h-px flex-1 bg-zinc-700" />
        </div>

        <Link
          href="/artist/apply"
          className="block w-full rounded-xl border border-zinc-700 bg-zinc-800 py-3 text-center font-semibold text-white transition hover:bg-zinc-700"
        >
          🎨 Sanatçı Ol
        </Link>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-zinc-500 transition hover:text-white"
        >
          Ana Sayfaya Dön
        </Link>

      </div>
    </main>
  );
}