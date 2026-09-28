"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

type OrderItem = {
  title: string;
  artist: string;
  image: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: any;
  items: OrderItem[];
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (createdAt: any) => {
  if (!createdAt) return "Tarih belirtilmemiş";

  try {
    const date = createdAt?.toDate
      ? createdAt.toDate()
      : new Date(createdAt);

    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Tarih belirtilmemiş";
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        })) as Order[];

        setOrders(data);
      } catch (error) {
        console.error("Siparişler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

          <p className="text-zinc-400">
            Siparişleriniz yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
            SANART
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Siparişlerim
          </h1>

          <p className="mt-3 text-zinc-400">
            Geçmiş siparişlerinizi ve sipariş detaylarınızı buradan takip
            edebilirsiniz.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-16 text-center shadow-2xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-4xl">
              📦
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Henüz siparişiniz bulunmuyor
            </h2>

            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              SanArt koleksiyonundaki eserleri keşfederek ilk siparişinizi
              oluşturabilirsiniz.
            </p>

            <Link
              href="/paintings"
              className="mt-8 inline-flex rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              Eserleri Keşfet
            </Link>

          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl"
              >

                <div className="border-b border-zinc-800 p-5 sm:p-7">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                        SİPARİŞ
                      </p>

                      <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </h2>

                      <p className="mt-2 text-sm text-zinc-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="sm:text-right">

                      <span className="inline-flex rounded-full border border-green-800 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                        {order.status}
                      </span>

                      <p className="mt-3 text-2xl font-bold">
                        {formatPrice(order.total)}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-5 sm:p-7">

                  <div className="mb-5">
                    <h3 className="text-lg font-semibold">
                      Sipariş İçeriği
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {order.items.length} farklı eser
                    </p>
                  </div>

                  <div className="space-y-4">

                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                          <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:h-24 sm:w-24">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 96px"
                              className="object-contain p-2"
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <h4 className="truncate text-lg font-bold">
                              {item.title}
                            </h4>

                            <p className="mt-1 text-sm text-zinc-400">
                              {item.artist}
                            </p>

                            <p className="mt-2 text-sm text-zinc-500">
                              {item.quantity} adet
                            </p>

                          </div>

                          <div className="sm:text-right">

                            <p className="text-lg font-bold">
                              {formatPrice(
                                item.price * item.quantity
                              )}
                            </p>

                            {item.quantity > 1 && (
                              <p className="mt-1 text-xs text-zinc-500">
                                Birim: {formatPrice(item.price)}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-sm text-zinc-500">
                        Teslimat
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {order.customerName}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-zinc-500">
                        Toplam
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">

          <Link
            href="/account"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Hesabıma Dön
          </Link>

          <Link
            href="/"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Ana Sayfaya Dön
          </Link>

        </div>

      </div>
    </main>
  );
}