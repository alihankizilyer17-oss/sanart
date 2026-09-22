"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

type Order = {
  id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: any;
  items: {
    title: string;
    artist: string;
    image: string;
    quantity: number;
    price: number;
  }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      setOrders(data);
    };

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-10 text-5xl font-bold">
          📦 Siparişlerim
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-zinc-900 p-10 text-center">
            <p className="text-xl text-zinc-400">
              Henüz siparişiniz bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="space-y-8">

            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-zinc-900 p-6"
              >

                <div className="mb-6 flex items-center justify-between border-b border-zinc-700 pb-5">

                  <div>
                    <h2 className="text-2xl font-bold">
                      Sipariş
                    </h2>

                    <p className="mt-2 text-zinc-400">
                      {order.customerName}
                    </p>
                  </div>

                  <div className="text-right">

                    <span className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold">
                      {order.status}
                    </span>

                    <h3 className="mt-4 text-2xl font-bold">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                        maximumFractionDigits: 0,
                      }).format(order.total)}
                    </h3>

                  </div>

                </div>

                <div className="space-y-5">

                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-5"
                    >

                      <Image
                        src={item.image}
                        alt={item.title}
                        width={100}
                        height={100}
                        className="rounded-xl object-cover"
                      />

                      <div className="flex-1">

                        <h3 className="text-xl font-bold">
                          {item.title}
                        </h3>

                        <p className="text-zinc-400">
                          {item.artist}
                        </p>

                        <p className="mt-2">
                          Adet : {item.quantity}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-xl font-bold">
                          {new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                            maximumFractionDigits: 0,
                          }).format(item.price)}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}