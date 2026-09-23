"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

type FavoriteItem = {
  id: string;
  productId: string;
  title: string;
  artist: string;
  price: number;
  image: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((favoriteDoc) => ({
          id: favoriteDoc.id,
          ...favoriteDoc.data(),
        })) as FavoriteItem[];

        setFavorites(data);
      } catch (error) {
        console.error("Favoriler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeFavorite = async (id: string) => {
    try {
      await deleteDoc(doc(db, "favorites", id));

      setFavorites((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Favori silinemedi:", error);
      alert("Favori silinemedi.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-400">Favorileriniz yükleniyor...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-10 text-center shadow-2xl">
          <div className="text-5xl">❤️</div>

          <h1 className="mt-5 text-3xl font-bold">
            Favorilerim
          </h1>

          <p className="mt-3 text-zinc-400">
            Favorilerinizi görmek için hesabınıza giriş yapmalısınız.
          </p>

          <Link
            href="/login"
            className="mt-8 block w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            Giriş Yap
          </Link>

          <Link
            href="/register"
            className="mt-4 block w-full rounded-xl border border-zinc-600 py-3 font-semibold text-white transition hover:border-white hover:bg-zinc-800"
          >
            Kayıt Ol
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <h1 className="text-4xl font-bold sm:text-5xl">
            ❤️ Favorilerim
          </h1>

          <p className="mt-3 text-zinc-400">
            Beğendiğiniz tabloları burada bulabilirsiniz.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <div className="text-5xl">🤍</div>

            <h2 className="mt-5 text-2xl font-bold">
              Henüz favoriniz yok
            </h2>

            <p className="mt-3 text-zinc-400">
              Beğendiğiniz tabloları favorilerinize ekleyerek
              daha sonra kolayca bulabilirsiniz.
            </p>

            <Link
              href="/paintings"
              className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              Tabloları Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <button
                  onClick={() => removeFavorite(item.id)}
                  aria-label={`${item.title} favorilerden kaldır`}
                  className="absolute right-3 top-3 z-20 rounded-full bg-black/70 p-2 text-xl transition hover:bg-red-600"
                >
                  ❤️
                </button>

                <Link href={`/product/${item.productId}`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-zinc-400">
                      {item.artist}
                    </p>

                    <p className="mt-4 text-2xl font-bold">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                        maximumFractionDigits: 0,
                      }).format(item.price)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}