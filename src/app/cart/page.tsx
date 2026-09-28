"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type CartItem = {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
  userId: string;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "cart"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as CartItem[];

      setCartItems(data);
    } catch (error) {
      console.error("Sepet yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const increaseQuantity = async (item: CartItem) => {
    try {
      setUpdatingId(item.id);

      await updateDoc(doc(db, "cart", item.id), {
        quantity: item.quantity + 1,
      });

      await loadCart();
    } catch (error) {
      console.error(error);
      alert("Ürün adedi güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQuantity = async (item: CartItem) => {
    if (item.quantity <= 1) return;

    try {
      setUpdatingId(item.id);

      await updateDoc(doc(db, "cart", item.id), {
        quantity: item.quantity - 1,
      });

      await loadCart();
    } catch (error) {
      console.error(error);
      alert("Ürün adedi güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (id: string) => {
    try {
      setUpdatingId(id);

      await deleteDoc(doc(db, "cart", id));

      await loadCart();
    } catch (error) {
      console.error(error);
      alert("Ürün sepetten silinemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

          <p className="text-zinc-400">
            Sepetiniz yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
            SANART
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Sepetim
          </h1>

          <p className="mt-3 text-zinc-400">
            Seçtiğiniz eserleri inceleyin ve siparişinizi tamamlayın.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-16 text-center shadow-2xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-4xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Sepetiniz boş
            </h2>

            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              Henüz sepetinize bir eser eklemediniz.
              SanArt koleksiyonunu keşfedebilirsiniz.
            </p>

            <Link
              href="/paintings"
              className="mt-8 inline-flex rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              Eserleri Keşfet
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">

            <section className="space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl sm:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">

                    <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:h-32 sm:w-32">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">
                          <h2 className="truncate text-xl font-bold sm:text-2xl">
                            {item.title}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-400">
                            {item.artist}
                          </p>
                        </div>

                        <p className="text-xl font-bold whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </p>

                      </div>

                      <p className="mt-3 text-sm text-zinc-500">
                        Birim fiyat: {formatPrice(item.price)}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-3">

                        <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900">

                          <button
                            onClick={() => decreaseQuantity(item)}
                            disabled={
                              item.quantity <= 1 ||
                              updatingId === item.id
                            }
                            className="flex h-10 w-10 items-center justify-center text-xl text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="flex h-10 min-w-10 items-center justify-center border-x border-zinc-800 px-3 font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item)}
                            disabled={updatingId === item.id}
                            className="flex h-10 w-10 items-center justify-center text-xl text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>

                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updatingId === item.id}
                          className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === item.id
                            ? "İşleniyor..."
                            : "Ürünü Kaldır"}
                        </button>

                      </div>

                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/paintings"
                className="inline-flex items-center pt-2 text-sm text-zinc-400 transition hover:text-white"
              >
                ← Eserlere devam et
              </Link>

            </section>

            <aside className="lg:sticky lg:top-8 lg:self-start">

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-7">

                <h2 className="text-2xl font-bold">
                  Sipariş Özeti
                </h2>

                <div className="mt-7 space-y-4">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">
                      Ara toplam
                    </span>

                    <span className="font-medium">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800 pb-5 text-sm">
                    <span className="text-zinc-400">
                      Kargo
                    </span>

                    <span className="font-semibold text-green-500">
                      Ücretsiz
                    </span>
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <span className="text-lg font-semibold">
                      Toplam
                    </span>

                    <span className="text-3xl font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>

                </div>

                <Link
                  href="/checkout"
                  className="mt-8 block w-full rounded-xl bg-white py-4 text-center font-bold text-black transition hover:bg-zinc-200"
                >
                  Siparişi Tamamla
                </Link>

                <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">

                  <p className="text-sm font-medium">
                    🔒 Güvenli alışveriş
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Sipariş bilgileriniz güvenli şekilde işlenir.
                  </p>

                </div>

              </div>

            </aside>

          </div>
        )}

      </div>
    </main>
  );
}