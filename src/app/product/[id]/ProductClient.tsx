
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Heart } from "lucide-react";

import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

type Product = {
  title: string;
  artist: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

type ProductClientProps = {
  id: string;
};

export default function ProductClient({
  id,
}: ProductClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProduct(snap.data() as Product);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Lütfen önce giriş yapın.");
      return;
    }

    try {
      setAddingToCart(true);

      const q = query(
        collection(db, "cart"),
        where("productId", "==", id),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const cartDoc = snapshot.docs[0];
        const currentQuantity =
          cartDoc.data().quantity || 1;

        await updateDoc(cartDoc.ref, {
          quantity: currentQuantity + 1,
        });

        alert("🛒 Ürün adedi artırıldı!");
      } else {
        await addDoc(collection(db, "cart"), {
          userId: user.uid,
          productId: id,
          title: product.title,
          artist: product.artist,
          price: product.price,
          image: product.image,
          quantity: 1,
          createdAt: new Date(),
        });

        alert("🛒 Ürün sepete eklendi!");
      }
    } catch (error) {
      console.error(error);
      alert("Sepete eklenirken hata oluştu.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

          <p className="text-zinc-400">
            Eser yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">

        <Link
          href="/paintings"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Tüm Eserlere Dön
        </Link>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

          <div className="lg:sticky lg:top-8">

            <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-3 shadow-2xl sm:p-5">

              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-zinc-900 sm:min-h-[600px]">

                <Image
                  src={product.image}
                  alt={product.title}
                  width={900}
                  height={1100}
                  priority
                  className="h-auto max-h-[75vh] w-full object-contain"
                />

              </div>

            </div>

            <p className="mt-4 text-center text-xs tracking-wide text-zinc-600">
              SanArt • Özgün Sanat Eseri
            </p>

          </div>

          <div className="lg:pt-6">

            <div className="flex items-center justify-between gap-4">

              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-300">
                🎨 {product.category}
              </span>

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                aria-label="Favorilere ekle"
              >
                <Heart size={20} />
              </button>

            </div>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {product.title}
            </h1>

            <p className="mt-4 text-lg text-zinc-400">
              Eser sahibi{" "}
              <span className="font-medium text-white">
                {product.artist}
              </span>
            </p>

            <div className="my-8 h-px bg-zinc-800" />

            <div>

              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Eser Fiyatı
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                {new Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </p>

            </div>

            <div className="mt-10">

              <h2 className="text-lg font-semibold">
                Eser Hakkında
              </h2>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-400">
                {product.description}
              </p>

            </div>

            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full rounded-xl bg-white py-4 text-base font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addingToCart
                  ? "Sepete Ekleniyor..."
                  : "🛒 Sepete Ekle"}
              </button>

              <p className="mt-4 text-center text-xs text-zinc-500">
                Eseri sepetinize ekleyerek satın alma işlemine devam edebilirsiniz.
              </p>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                <ShieldCheck
                  className="mb-3 text-zinc-300"
                  size={22}
                />

                <p className="text-sm font-semibold">
                  Güvenli Alışveriş
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Güvenli alışveriş deneyimi
                </p>

              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                <Truck
                  className="mb-3 text-zinc-300"
                  size={22}
                />

                <p className="text-sm font-semibold">
                  Özenli Gönderim
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Eserler özenle hazırlanır
                </p>

              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                <ShieldCheck
                  className="mb-3 text-zinc-300"
                  size={22}
                />

                <p className="text-sm font-semibold">
                  Özgün Eser
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Sanatçı tarafından sunulur
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

