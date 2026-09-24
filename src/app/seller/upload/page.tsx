"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/categories/portre.jpg");
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
  try {
    setSaving(true);
if (!auth.currentUser) {
  alert("Ürün eklemek için giriş yapmalısınız.");
  return;
}

if (!title || !artist || !price || !category || !description) {
  alert("Lütfen tüm alanları doldurun.");
  return;
}

if (Number(price) <= 0) {
  alert("Fiyat 0'dan büyük olmalıdır.");
  return;
}


await addDoc(collection(db, "products"), {
  title,
  artist,
  price: Number(price),
  category,
  description,
  image,
  sellerId: auth.currentUser.uid,
  sellerEmail: auth.currentUser.email,
  createdAt: new Date(),
});

    alert("Tablo başarıyla eklendi!");

    setTitle("");
    setArtist("");
    setPrice("");
    setCategory("");
    setDescription("");
  } catch (error) {
    console.error(error);
    alert("Bir hata oluştu.");
  } finally {
  setSaving(false);
}
};

  return (
    <main className="min-h-screen bg-black flex justify-center py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-900 p-8">

        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Yeni Tablo Ekle
        </h1>

        <input
          type="text"
          placeholder="Tablo Adı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none"
        />

        <input
          type="text"
          placeholder="Sanatçı Adı"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="mb-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none"
        />

        <input
          type="number"
          placeholder="Fiyat"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mb-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none"
        />

        <input
          type="text"
          placeholder="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none"
        />

        <textarea
          placeholder="Tablo Açıklaması"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-6 h-40 w-full rounded-xl bg-zinc-800 p-4 text-white outline-none"
        />

       <button
  onClick={handleSave}
  disabled={saving}
  className="w-full rounded-xl bg-white py-3 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving ? "Kaydediliyor..." : "Tabloyu Kaydet"}
</button>

      </div>
    </main>
  );
}