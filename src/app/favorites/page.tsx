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

  useEffect(() => {
    const loadFavorites = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FavoriteItem[];

      setFavorites(data);
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (id: string) => {
    try {
      await deleteDoc(doc(db, "favorites", id));

      setFavorites((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Favori silinemedi.");
    }
  };

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-10 text-5xl font-bold">
          ❤️ Favorilerim
        </h1>

        {favorites.length === 0 ? (
          <p className="text-zinc-400">
            Henüz favorilere eklediğiniz bir tablo yok.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl bg-zinc-900 transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <button
                  onClick={() => removeFavorite(item.id)}
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
                    className="h-72 w-full object-cover"
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