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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      setCartItems([]);
      return;
    }

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
  };

  useEffect(() => {
    loadCart();
  }, []);

  const increaseQuantity = async (item: CartItem) => {
    await updateDoc(doc(db, "cart", item.id), {
      quantity: item.quantity + 1,
    });

    loadCart();
  };

  const decreaseQuantity = async (item: CartItem) => {
    if (item.quantity <= 1) return;

    await updateDoc(doc(db, "cart", item.id), {
      quantity: item.quantity - 1,
    });

    loadCart();
  };

  const removeItem = async (id: string) => {
    await deleteDoc(doc(db, "cart", id));
    loadCart();
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-10 text-5xl font-bold">
          🛒 Sepetim
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-zinc-400">
            Sepetiniz şu anda boş.
          </p>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-zinc-900 p-5"
                >
                  <div className="flex items-center gap-6">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={120}
                      height={120}
                      className="rounded-xl object-cover"
                    />

                    <div>
                      <h2 className="text-2xl font-bold">
                        {item.title}
                      </h2>

                      <p className="text-zinc-400">
                        {item.artist}
                      </p>

                      <p className="mt-3 text-xl font-bold">
                        {new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                          maximumFractionDigits: 0,
                        }).format(item.price)}
                      </p>

                      <div className="mt-4 flex items-center gap-3">

                        <button
                          onClick={() => decreaseQuantity(item)}
                          className="h-10 w-10 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                        >
                          −
                        </button>

                        <span className="text-lg font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item)}
                          className="h-10 w-10 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-6 rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
                        >
                          🗑️ Sil
                        </button>

                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-zinc-900 p-6">
              <div className="flex items-center justify-between">
                <div className="mt-10 rounded-2xl bg-zinc-900 p-8">

  <div className="flex justify-between border-b border-zinc-700 pb-4">
    <span className="text-zinc-400">
      Ara Toplam
    </span>

    <span className="font-semibold">
      {new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(total)}
    </span>
  </div>

  <div className="mt-4 flex justify-between border-b border-zinc-700 pb-4">
    <span className="text-zinc-400">
      Kargo
    </span>

    <span className="text-green-500 font-semibold">
      Ücretsiz
    </span>
  </div>

  <div className="mt-6 flex justify-between text-2xl font-bold">
    <span>Genel Toplam</span>

    <span>
      {new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(total)}
    </span>
  </div>

  <Link href="/checkout">
  <button className="mt-8 w-full rounded-xl bg-white py-4 text-lg font-bold text-black transition hover:bg-zinc-200">
    Siparişi Tamamla
  </button>
</Link>

</div>

                <h2 className="text-3xl font-bold">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                    maximumFractionDigits: 0,
                  }).format(total)}
                </h2>
              </div>

              <button className="mt-8 w-full rounded-xl bg-white py-4 font-bold text-black hover:bg-zinc-200">
                Siparişi Tamamla
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}