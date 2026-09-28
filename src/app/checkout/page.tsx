"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

type CartItem = {
  id: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  quantity: number;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "cart"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const items = snapshot.docs.map((cartDoc) => ({
          id: cartDoc.id,
          ...cartDoc.data(),
        })) as CartItem[];

        setCartItems(items);
      } catch (error) {
        console.error("Sepet yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
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
      alert("Lütfen önce giriş yapın.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Sepetiniz boş.");
      return;
    }

    if (
      !name.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !district.trim() ||
      !address.trim()
    ) {
      alert("Lütfen tüm teslimat bilgilerini doldurun.");
      return;
    }

    try {
      setCreatingOrder(true);

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        district: district.trim(),
        address: address.trim(),
        items: cartItems,
        total,
        status: "Beklemede",
        createdAt: new Date(),
      });

      for (const item of cartItems) {
        await deleteDoc(doc(db, "cart", item.id));
      }

      setCartItems([]);
      setOrderCreated(true);
    } catch (error) {
      console.error("Sipariş oluşturulamadı:", error);
      alert("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />

          <p className="text-zinc-400">
            Sipariş bilgileri yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  if (orderCreated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl sm:p-12">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-4xl">
            ✓
          </div>

          <h1 className="mt-7 text-3xl font-bold sm:text-4xl">
            Siparişiniz Oluşturuldu
          </h1>

          <p className="mt-4 leading-7 text-zinc-400">
            Siparişiniz başarıyla kaydedildi. Sipariş durumunuzu
            hesabınız üzerinden takip edebilirsiniz.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <Link
              href="/orders"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              Siparişlerim
            </Link>

            <Link
              href="/paintings"
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-white transition hover:bg-zinc-900"
            >
              Eserlere Dön
            </Link>

          </div>

        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl sm:p-12">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-4xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Sepetiniz boş
          </h1>

          <p className="mt-3 text-zinc-400">
            Sipariş oluşturabilmek için önce sepetinize bir eser ekleyin.
          </p>

          <Link
            href="/paintings"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            Eserleri Keşfet
          </Link>

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
            Siparişi Tamamla
          </h1>

          <p className="mt-3 text-zinc-400">
            Teslimat bilgilerinizi girerek siparişinizi oluşturun.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8">

            <h2 className="text-2xl font-bold">
              Teslimat Bilgileri
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Eserinizin gönderileceği bilgileri eksiksiz girin.
            </p>

            <div className="mt-8 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Ad Soyad
                </label>

                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Telefon
                </label>

                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    İl
                  </label>

                  <input
                    type="text"
                    placeholder="İl"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    İlçe
                  </label>

                  <input
                    type="text"
                    placeholder="İlçe"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Açık Adres
                </label>

                <textarea
                  placeholder="Mahalle, sokak, bina no, daire no..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-500"
                />
              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">

              <p className="text-sm font-semibold">
                🔒 Bilgileriniz güvende
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Teslimat bilgileriniz siparişinizin gönderilmesi için kullanılır.
              </p>

            </div>

          </section>

          <aside className="lg:sticky lg:top-8 lg:self-start">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-7">

              <h2 className="text-2xl font-bold">
                Sipariş Özeti
              </h2>

              <div className="mt-7 space-y-5">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {item.quantity} adet
                      </p>

                      <p className="mt-2 font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              <div className="mt-7 border-t border-zinc-800 pt-6">

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Ara toplam
                  </span>

                  <span>
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="mt-4 flex justify-between border-b border-zinc-800 pb-5 text-sm">
                  <span className="text-zinc-400">
                    Kargo
                  </span>

                  <span className="font-semibold text-green-500">
                    Ücretsiz
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">

                  <span className="text-lg font-semibold">
                    Toplam
                  </span>

                  <span className="text-3xl font-bold">
                    {formatPrice(total)}
                  </span>

                </div>

              </div>

              <button
                onClick={handleOrder}
                disabled={creatingOrder}
                className="mt-8 w-full rounded-xl bg-white py-4 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingOrder
                  ? "Sipariş Oluşturuluyor..."
                  : "Siparişi Oluştur"}
              </button>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}