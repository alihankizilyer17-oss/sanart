"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

type Product = {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  category: string;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("default");

  // URL üzerinden gelen arama kelimesini al
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");

    if (search) {
      setSearchTerm(search);
    }
  }, []);

  // Ürünleri yükle
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const data = querySnapshot.docs.map((productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        })) as Product[];

        setProducts(data);
      } catch (error) {
        console.error("Ürünler yüklenemedi:", error);
      }
    };

    loadProducts();
  }, []);

  // Kullanıcının favorilerini yükle
  useEffect(() => {
    const loadFavorites = async () => {
      const user = auth.currentUser;

      if (!user) return;

      try {
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        setFavorites(
          snapshot.docs.map(
            (favoriteDoc) => favoriteDoc.data().productId as string
          )
        );
      } catch (error) {
        console.error("Favoriler yüklenemedi:", error);
      }
    };

    loadFavorites();
  }, []);

  // Favoriye ekle veya favorilerden kaldır
  const toggleFavorite = async (product: Product) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Lütfen önce giriş yapın.");
      return;
    }

    try {
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);

        setFavorites((prev) =>
          prev.filter((id) => id !== product.id)
        );
      } else {
        await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          productId: product.id,
          title: product.title,
          artist: product.artist,
          price: product.price,
          image: product.image,
          createdAt: new Date(),
        });

        setFavorites((prev) => [...prev, product.id]);
      }
    } catch (error) {
      console.error("Favori güncellenemedi:", error);
      alert("Favori işlemi sırasında bir hata oluştu.");
    }
  };

  // Arama, kategori ve sıralama
  const filteredProducts = products
    .filter((product) => {
      const term = searchTerm.trim().toLocaleLowerCase("tr-TR");

      const title = (product.title || "").toLocaleLowerCase("tr-TR");
      const artist = (product.artist || "").toLocaleLowerCase("tr-TR");

      const matchesSearch =
        !term || title.includes(term) || artist.includes(term);

      const matchesCategory =
        selectedCategory === "Tümü" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "tr");
      }

      return 0;
    });

  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
      <h2 className="mb-10 text-center text-4xl font-bold italic tracking-wide text-white sm:text-5xl lg:text-6xl">
        Tablolar
      </h2>

      {/* Tablo arama */}
      <div className="mb-8">
        <input
          type="search"
          placeholder="Tablo veya sanatçı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-white outline-none focus:border-white"
        />
      </div>

      {/* Kategori seçimi */}
      <div className="mb-8 flex justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-white outline-none"
        >
          <option value="Tümü">Tüm Kategoriler</option>
          <option value="Manzara">Manzara</option>
          <option value="Portre">Portre</option>
          <option value="Soyut">Soyut</option>
          <option value="Minimal">Minimal</option>
        </select>
      </div>

      {/* Sıralama */}
      <div className="mb-8 flex justify-center">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-white outline-none"
        >
          <option value="default">Sıralama</option>
          <option value="price-asc">💸 Fiyat: Düşük → Yüksek</option>
          <option value="price-desc">💎 Fiyat: Yüksek → Düşük</option>
          <option value="title">🔤 İsim: A → Z</option>
        </select>
      </div>

      {/* Ürünler */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-14 text-center">
          <p className="text-xl font-semibold text-white">
            Eser bulunamadı
          </p>

          <p className="mt-2 text-zinc-400">
            Farklı bir tablo veya sanatçı adı deneyebilirsin.
          </p>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("Tümü");
              setSortBy("default");
            }}
            className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl bg-zinc-900 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  aria-label={
                    favorites.includes(product.id)
                      ? "Favorilerden kaldır"
                      : "Favorilere ekle"
                  }
                  className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2"
                >
                  <Heart
                    size={20}
                    className={`transition ${
                      favorites.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-white hover:text-red-500"
                    }`}
                  />
                </button>

                <Link href={`/product/${product.id}`}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

              <div className="p-5">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-xl font-bold text-white hover:underline">
                    {product.title}
                  </h3>

                  <p className="mt-1 text-zinc-400">
                    {product.artist}
                  </p>

                  <p className="mt-4 text-2xl font-bold text-white">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </p>
                </Link>

                <Link
                  href={`/product/${product.id}`}
                  className="mt-5 block w-full rounded-xl bg-white py-3 text-center font-semibold text-black transition hover:bg-zinc-200"
                >
                  Eseri İncele
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}