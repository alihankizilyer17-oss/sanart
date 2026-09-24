"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        email: user.email,
        role: "user",
        createdAt: new Date(),
      });

      alert("Hesap başarıyla oluşturuldu!");

      router.push("/account");
    } catch (error: any) {
      alert("Kayıt başarısız: " + error.message);
    }
  };

 return (
  <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
    <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-10 shadow-2xl">

      <h1 className="text-center text-4xl font-bold text-white">
        Kayıt Ol
      </h1>

      <p className="mt-2 text-center text-zinc-400">
        SanArt hesabınızı oluşturun.
      </p>

      <input
        type="text"
        placeholder="Ad"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="mt-8 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none focus:ring-2 focus:ring-white"
      />

      <input
        type="text"
        placeholder="Soyad"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="mt-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none focus:ring-2 focus:ring-white"
      />

      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none focus:ring-2 focus:ring-white"
      />

      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none focus:ring-2 focus:ring-white"
      />

      <button
        onClick={handleRegister}
        className="mt-6 w-full rounded-xl bg-white py-3 font-bold text-black transition hover:bg-zinc-200"
      >
        Kayıt Ol
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
        href="/login"
        className="mt-3 block w-full rounded-xl border border-zinc-800 py-3 text-center text-zinc-400 transition hover:text-white"
      >
        Zaten hesabınız var mı? Giriş Yap
      </Link>

    </div>
  </main>
);
}