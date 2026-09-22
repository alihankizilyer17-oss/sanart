"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";

type CartItem = {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "cart"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      setCartItems(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CartItem[]
      );
    };

    loadCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

const handleOrder = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Lütfen giriş yapın.");
    return;
  }

  if (
    !name ||
    !phone ||
    !city ||
    !district ||
    !address
  ) {
    alert("Lütfen tüm adres bilgilerini doldurun.");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      customerName: name,
      phone,
      city,
      district,
      address,
      items: cartItems,
      total,
      status: "Beklemede",
      createdAt: new Date(),
    });

    for (const item of cartItems) {
      await deleteDoc(doc(db, "cart", item.id));
    }

    alert("🎉 Siparişiniz başarıyla oluşturuldu.");

    setCartItems([]);

  } catch (error) {
    console.error(error);
    alert("Sipariş oluşturulamadı.");
  }
};

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10">

        <div className="rounded-2xl bg-zinc-900 p-8">

          <h1 className="mb-8 text-4xl font-bold">
            Teslimat Bilgileri
          </h1>

          <input
            placeholder="Ad Soyad"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="mb-4 w-full rounded-xl bg-zinc-800 p-4 outline-none"
          />

          <input
            placeholder="Telefon"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            className="mb-4 w-full rounded-xl bg-zinc-800 p-4 outline-none"
          />

          <input
            placeholder="İl"
            value={city}
            onChange={(e)=>setCity(e.target.value)}
            className="mb-4 w-full rounded-xl bg-zinc-800 p-4 outline-none"
          />

          <input
            placeholder="İlçe"
            value={district}
            onChange={(e)=>setDistrict(e.target.value)}
            className="mb-4 w-full rounded-xl bg-zinc-800 p-4 outline-none"
          />

          <textarea
            placeholder="Adres"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
            className="h-40 w-full rounded-xl bg-zinc-800 p-4 outline-none"
          />

        </div>

        <div className="rounded-2xl bg-zinc-900 p-8">

          <h2 className="mb-8 text-3xl font-bold">
            Sipariş Özeti
          </h2>

          <div className="space-y-5">

            {cartItems.map(item=>(
              <div
                key={item.id}
                className="flex items-center gap-5"
              >

                <Image
                  src={item.image}
                  alt={item.title}
                  width={90}
                  height={90}
                  className="rounded-xl object-cover"
                />

                <div className="flex-1">

                  <h3 className="font-bold">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400">
                    {item.quantity} Adet
                  </p>

                </div>

                <span className="font-bold">
                  {new Intl.NumberFormat("tr-TR",{
                    style:"currency",
                    currency:"TRY",
                    maximumFractionDigits:0,
                  }).format(item.price*item.quantity)}
                </span>

              </div>
            ))}

          </div>

          <div className="mt-10 border-t border-zinc-700 pt-6">

            <div className="flex justify-between">

              <span>Genel Toplam</span>

              <span className="text-2xl font-bold">
                {new Intl.NumberFormat("tr-TR",{
                  style:"currency",
                  currency:"TRY",
                  maximumFractionDigits:0,
                }).format(total)}
              </span>

            </div>

            <button
  onClick={handleOrder}
  className="mt-8 w-full rounded-xl bg-white py-4 font-bold text-black transition hover:bg-zinc-200"
>
  Siparişi Oluştur
</button>

          </div>

        </div>

      </div>
    </main>
  );
}