"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Product = {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
};

export default function ArtistPage() {
  const [artists, setArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        const artistNames = snapshot.docs
          .map((doc) => {
            const data = doc.data() as Product;
            return data.artist;
          })
          .filter(Boolean);

        const uniqueArtists = [...new Set(artistNames)];

        setArtists(uniqueArtists);
      } catch (error) {
        console.error("Sanatçılar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-900 to-black p-10 text-white">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/"
          className="mb-10 inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white transition hover:bg-zinc-800"
        >
          ← Ana Sayfaya Dön
        </Link>

        <h1 className="text-center text-6xl font-black italic tracking-[0.2em]">
          Sanatçılar
        </h1>

        <p className="mt-6 text-center text-zinc-400">
          SanArt sanatçılarını keşfedin.
        </p>

        {loading ? (
          <p className="mt-16 text-center text-zinc-400">
            Sanatçılar yükleniyor...
          </p>
        ) : artists.length === 0 ? (
          <p className="mt-16 text-center text-zinc-400">
            Henüz kayıtlı sanatçı bulunmuyor.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <div
                key={artist}
                className="rounded-2xl border border-zinc-700 bg-zinc-900 p-8 text-center transition duration-300 hover:-translate-y-2 hover:bg-zinc-800 hover:shadow-2xl"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-4xl">
                  🎨
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  {artist}
                </h2>

                <p className="mt-2 text-zinc-400">
                  SanArt Sanatçısı
                </p>

               <Link
  href={`/artist/${encodeURIComponent(artist)}`}
  className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
>
  Eserlerini Gör
</Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}