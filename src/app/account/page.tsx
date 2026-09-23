"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;

          setProfile(data);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
        }
      } catch (error) {
        console.error("Profil bilgileri alınamadı:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!firstName.trim() || !lastName.trim()) {
      alert("Ad ve soyad boş bırakılamaz.");
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
            }
          : prev
      );

      alert("Profil bilgileriniz güncellendi.");
    } catch (error) {
      console.error("Profil güncellenemedi:", error);
      alert("Profil güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-zinc-400">Hesabınız yükleniyor...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-10 shadow-2xl">
          <h1 className="text-center text-4xl font-bold text-white">
            SanArt
          </h1>

          <p className="mt-3 text-center text-zinc-400">
            Hesabınıza giriş yapın
          </p>

          <Link
            href="/login"
            className="mt-8 block w-full rounded-xl bg-white py-3 text-center font-semibold text-black transition hover:bg-zinc-200"
          >
            Giriş Yap
          </Link>

          <Link
            href="/register"
            className="mt-4 block w-full rounded-xl border border-white py-3 text-center font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Kayıt Ol
          </Link>

          <div className="my-8 border-t border-zinc-700" />

          <p className="text-center text-zinc-400">
            Sanatçı mısınız?
          </p>

          <Link
            href="/seller"
            className="mt-4 block w-full rounded-xl border border-zinc-600 py-3 text-center text-white transition hover:border-white hover:bg-zinc-800"
          >
            🎨 Sanatçı Paneline Git
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-zinc-900 p-8 shadow-2xl">

          <h1 className="text-3xl font-bold text-white">
            Hesabım
          </h1>

          <p className="mt-2 text-zinc-400">
            SanArt hesabınızı buradan yönetebilirsiniz.
          </p>

          {/* PROFİL */}
          <div className="mt-8 rounded-2xl bg-zinc-800 p-6">

            <h2 className="text-xl font-semibold text-white">
              Profil Bilgileri
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Ad
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white outline-none transition focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Soyad
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-white outline-none transition focus:border-white"
                />
              </div>

            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-zinc-400">
                E-posta
              </label>

              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-zinc-400">
                {profile?.email || user.email}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>

          </div>

          {/* HIZLI ERİŞİM */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <Link
              href="/favorites"
              className="rounded-2xl border border-zinc-700 bg-zinc-800 p-5 text-white transition hover:border-white"
            >
              <div className="text-2xl">❤️</div>

              <h2 className="mt-3 font-semibold">
                Favorilerim
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Beğendiğiniz tabloları görüntüleyin.
              </p>
            </Link>

            <Link
              href="/orders"
              className="rounded-2xl border border-zinc-700 bg-zinc-800 p-5 text-white transition hover:border-white"
            >
              <div className="text-2xl">📦</div>

              <h2 className="mt-3 font-semibold">
                Siparişlerim
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Siparişlerinizi görüntüleyin.
              </p>
            </Link>

          </div>

          {/* ÇIKIŞ */}
          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-xl border border-red-500/50 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            Çıkış Yap
          </button>

        </div>
      </div>
    </main>
  );
}