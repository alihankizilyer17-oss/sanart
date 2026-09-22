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
  useEffect(() => {
    const loadProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(data);
    };


  loadProducts();
}, []);


useEffect(() => {
  const loadFavorites = async () => {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    setFavorites(
      snapshot.docs.map((doc) => doc.data().productId as string)
    );
  };

  loadFavorites();
}, []);


const toggleFavorite = async (product: Product) => {
  const user = auth.currentUser;

  if (!user) {
    alert("Lütfen önce giriş yapın.");
    return;
  }

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
};


  return (
    <section className="mx-auto mt-20 max-w-7xl px-6">
     <h2 className="mb-10 text-center text-6xl font-bold italic tracking-wide text-white">
  Tablolar
</h2>
<div className="mb-8">
  <input
    type="text"
    placeholder="Tablo veya sanatçı ara..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-white outline-none focus:border-white"
  />
</div>
<div className="mb-8 flex justify-center">
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-white outline-none"
  >
    <option value="Tümü">Tüm Kategoriler</option>
    <option value="Manzara">Manzara</option>
    <option value="Portre">Portre</option>
    <option value="Soyut">Soyut</option>
    <option value="Minimal">Minimal</option>
  </select>
</div>
<div className="mb-8 flex justify-center">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-white outline-none"
  >
    <option value="default">Sıralama</option>
    <option value="price-asc">💸 Fiyat: Düşük → Yüksek</option>
    <option value="price-desc">💎 Fiyat: Yüksek → Düşük</option>
    <option value="title">🔤 İsim: A → Z</option>
  </select>
</div>
      <div className="grid grid-cols-4 gap-8">
        {products
  .filter((product) => {
  const matchesSearch =
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.artist.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "Tümü" ||
    product.category === selectedCategory;

  return matchesSearch && matchesCategory;
})
.sort((a, b) => {
  if (sortBy === "price-asc") return a.price - b.price;
  if (sortBy === "price-desc") return b.price - a.price;
  if (sortBy === "title") return a.title.localeCompare(b.title, "tr");
  return 0;
})
.map((product) => (
          <div
            key={product.id}
            className="group overflow-hidden rounded-2xl bg-zinc-900 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Kalp */}
            <div className="relative">
              <button
  onClick={() => toggleFavorite(product)}
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

              {/* Resim */}
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
                  {product.price}
                </p>
              </Link>

              <Link href="/cart">
                <button className="mt-5 w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200">
                  🛒 Sepete Ekle
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}