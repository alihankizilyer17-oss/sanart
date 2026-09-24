"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
export default function SellerPage() {
  const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (!currentUser) {
      setProducts([]);
      setLoading(false);
      return;
    }
const userDoc = await getDoc(
  doc(db, "users", currentUser.uid)
);

if (!userDoc.exists()) {
  setProducts([]);
  setLoading(false);
  return;
}

const userData = userDoc.data();
if (userData.role !== "artist") {
  setProducts([]);
  setLoading(false);

  alert(
    "Bu alan sadece onaylanmış sanatçı hesaplarına açıktır."
  );

  router.push("/");
  return;
}
    try {
      const productsQuery = query(
        collection(db, "products"),
        where("sellerId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(productsQuery);

      const productData = snapshot.docs.map((productDoc) => ({
        id: productDoc.id,
        ...productDoc.data(),
      }));

      setProducts(productData);
    } catch (error) {
      console.error("Satıcı ürünleri alınamadı:", error);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

   

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-400">
          Panel yükleniyor...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-10 text-center">
          <h1 className="text-3xl font-bold">
            Satıcı Paneli
          </h1>

          <p className="mt-4 text-zinc-400">
  Sanatçı paneline erişmek için sanatçı hesabınızla
  giriş yapmalısınız.
</p>

          <Link
  href="/artist/login"
  className="mt-8 block rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200"
>
  🎨 Sanatçı Girişi
</Link>

          <Link
  href="/artist/apply"
  className="mt-4 block rounded-xl border border-zinc-700 py-3 font-semibold text-white transition hover:bg-zinc-800"
>
  🎨 Sanatçı Ol
</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl p-8">

        <h1 className="text-4xl font-bold">
          Sanatçı Paneli
        </h1>

        <p className="mt-2 text-zinc-400">
          Hoş geldiniz. Buradan eserlerinizi yönetebilirsiniz.
        </p>
<p className="mt-2 text-sm text-zinc-500">
  Giriş yapan hesap: {user.email}
</p>
        <div className="mt-10 grid grid-cols-2 gap-6">

          <Link
            href="/seller/upload"
            className="rounded-2xl bg-zinc-900 p-8 transition hover:bg-zinc-800"
          >
            <h2 className="text-2xl font-semibold">
              ➕ Yeni Tablo Ekle
            </h2>

            <p className="mt-2 text-zinc-400">
              Yeni bir tablo yükleyin.
            </p>
          </Link>

         <div className="rounded-2xl bg-zinc-900 p-8">
  <h2 className="text-2xl font-semibold">
    🖼️ Tablolarım
  </h2>

  <p className="mt-2 text-zinc-400">
    Yayındaki tablolarınızı görüntüleyin.
  </p>

  <div className="mt-6 space-y-4">
    {products.length === 0 ? (
      <p className="text-zinc-500">
        Henüz yüklediğiniz bir tablo bulunmuyor.
      </p>
    ) : (
      products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl border border-zinc-800 bg-black p-4"
        >
          <h3 className="text-lg font-semibold">
            {product.title}
          </h3>

          <p className="mt-1 text-zinc-400">
            {product.artist}
          </p>

          <p className="mt-2 font-semibold">
            {new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
        </div>
      ))
    )}
  </div>
</div>

          <div className="rounded-2xl bg-zinc-900 p-8">
            <h2 className="text-2xl font-semibold">
              📦 Siparişler
            </h2>

            <p className="mt-2 text-zinc-400">
              Gelen siparişleri görüntüleyin.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-8">
            <h2 className="text-2xl font-semibold">
              ⚙️ Hesap Ayarları
            </h2>

            <p className="mt-2 text-zinc-400">
              Profil bilgilerinizi düzenleyin.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}