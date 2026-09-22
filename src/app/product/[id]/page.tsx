"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

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

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const ref = doc(db, "products", id as string);
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
      const q = query(
        collection(db, "cart"),
        where("productId", "==", id),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const cartDoc = snapshot.docs[0];

        const currentQuantity = cartDoc.data().quantity || 1;

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
    }
  };

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Yükleniyor...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-12">
        <Image
          src={product.image}
          alt={product.title}
          width={600}
          height={700}
          className="rounded-3xl object-cover"
        />

        <div>
          <h1 className="text-5xl font-bold">{product.title}</h1>

          <p className="mt-3 text-zinc-400">{product.artist}</p>

          <p className="mt-3 inline-block rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
            🎨 {product.category}
          </p>

          <h2 className="mt-8 text-3xl font-bold">
            {new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </h2>

          <p className="mt-8 leading-8 text-zinc-300">
            {product.description}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-10 w-full rounded-xl bg-white py-4 font-semibold text-black transition hover:bg-zinc-200"
          >
            🛒 Sepete Ekle
          </button>
        </div>
      </div>
    </main>
  );
}