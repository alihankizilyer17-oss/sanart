"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Product = {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
};

type Artist = {
  name: string;
  bio: string;
  image: string;
};
export default function ArtistWorksPage() {
  const params = useParams();

  const artistName = decodeURIComponent(params.name as string);

  const [artist, setArtist] = useState<Artist | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtist = async () => {
      try {
        // Sanatçı bilgisini Firebase'den getir
        const artistQuery = query(
          collection(db, "artists"),
          where("name", "==", artistName)
        );

        const artistSnapshot = await getDocs(artistQuery);

        if (!artistSnapshot.empty) {
          setArtist(artistSnapshot.docs[0].data() as Artist);
        }

        // Sanatçının tablolarını getir
        const productQuery = query(
          collection(db, "products"),
          where("artist", "==", artistName)
        );

        const productSnapshot = await getDocs(productQuery);

        const productData = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(productData);
      } catch (error) {
        console.error("Sanatçı bilgileri yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArtist();
  }, [artistName]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-900 to-black p-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Geri Dön */}
        <Link
          href="/artist"
          className="mb-10 inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white transition hover:bg-zinc-800"
        >
          ← Sanatçılara Dön
        </Link>

        {/* Sanatçı Bilgileri */}
        <div className="mb-14 text-center">

         <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-zinc-800">
  {artist?.image ? (
    <Image
      src={artist.image}
      alt={artist.name}
      width={112}
      height={112}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-5xl">
      🎨
    </div>
  )}
</div>

          <h1 className="mt-6 bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-5xl font-black italic tracking-wide text-transparent">
            {artist?.name || artistName}
          </h1>

          <p className="mt-3 text-zinc-400">
            SanArt Sanatçısı
          </p>
{artist?.bio && (
  <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
    {artist.bio}
  </p>
)}
        </div>

        {/* İçerik */}
        {loading ? (
          <p className="text-center text-zinc-400">
            Sanatçı bilgileri yükleniyor...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-zinc-400">
            Bu sanatçıya ait eser bulunamadı.
          </p>
        ) : (
          <>
            <h2 className="mb-8 text-3xl font-bold">
              {artist?.name || artistName}'ın Eserleri
            </h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group overflow-hidden rounded-2xl bg-zinc-900 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-bold">
                      {product.title}
                    </h2>

                    <p className="mt-2 text-zinc-400">
                      {product.category}
                    </p>

                    <p className="mt-4 text-2xl font-bold">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}