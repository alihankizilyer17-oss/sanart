"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArtistApplyPage() {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const handleApply = async () => {
    if (
      !artistName ||
      !email ||
      !password ||
      !bio ||
      !category
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    try {
      setSaving(true);

      // Sanatçı hesabını oluştur
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Kullanıcı profilini oluştur
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        artistName,
        role: "artist_pending",
        createdAt: serverTimestamp(),
      });

      // Sanatçı başvurusunu oluştur
      await addDoc(
        collection(db, "artistApplications"),
        {
          userId: user.uid,
          email: user.email,
          artistName,
          bio,
          category,
          status: "pending",
          createdAt: serverTimestamp(),
        }
      );

      alert(
        "Sanatçı hesabınız oluşturuldu ve başvurunuz başarıyla gönderildi. Başvurunuz incelendikten sonra sanatçı paneline erişebilirsiniz."
      );

      router.push("/artist/login");
    } catch (error: any) {
      console.error(
        "Sanatçı başvurusu oluşturulamadı:",
        error
      );

      if (error.code === "auth/email-already-in-use") {
        alert(
          "Bu e-posta adresi zaten kullanılıyor. Sanatçı girişi sayfasından giriş yapmayı deneyin."
        );
      } else {
        alert(
          "Sanatçı hesabı oluşturulurken bir hata oluştu: " +
            error.message
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-900 p-8 shadow-2xl md:p-10">

        <Link
          href="/seller"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          ← Sanatçı paneline dön
        </Link>

        <div className="mt-6">
          <div className="mb-4 text-4xl">
            🎨
          </div>

          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Sanatçı Ol
          </h1>

          <p className="mt-3 leading-7 text-zinc-400">
            SanArt'ta eserlerinizi sergilemek ve satmak
            için sanatçı hesabınızı oluşturun.
          </p>
        </div>

        <div className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Sanatçı adı
            </label>

            <input
              type="text"
              placeholder="Örn. Alihan Kızılyer"
              value={artistName}
              onChange={(e) =>
                setArtistName(e.target.value)
              }
              className="w-full rounded-xl bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              E-posta
            </label>

            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Şifre
            </label>

            <input
              type="password"
              placeholder="En az 6 karakter"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Sanat alanı
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-xl bg-zinc-800 p-4 text-white outline-none focus:ring-2 focus:ring-white"
            >
              <option value="">
                Sanat alanınızı seçin
              </option>
              <option value="Resim">Resim</option>
              <option value="Yağlı Boya">
                Yağlı Boya
              </option>
              <option value="Akrilik">
                Akrilik
              </option>
              <option value="Suluboya">
                Suluboya
              </option>
              <option value="Dijital Sanat">
                Dijital Sanat
              </option>
              <option value="Heykel">Heykel</option>
              <option value="Fotoğraf">
                Fotoğraf
              </option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Kendinizi tanıtın
            </label>

            <textarea
              placeholder="Sanat geçmişinizden, çalışmalarınızdan ve tarzınızdan bahsedin..."
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              rows={6}
              className="w-full resize-none rounded-xl bg-zinc-800 p-4 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-white"
            />
          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-sm leading-6 text-zinc-400">
            Sanatçı hesabınız oluşturulduktan sonra
            başvurunuz SanArt ekibi tarafından
            incelenecektir. Başvurunuz onaylandığında
            sanatçı paneline erişebilir ve eserlerinizi
            yükleyebilirsiniz.
          </p>
        </div>

        <button
          onClick={handleApply}
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-white py-4 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Hesap Oluşturuluyor..."
            : "Sanatçı Hesabı Oluştur"}
        </button>

        <Link
          href="/artist/login"
          className="mt-4 block text-center text-sm text-zinc-500 transition hover:text-white"
        >
          Zaten sanatçı hesabınız var mı? Sanatçı Girişi
        </Link>

      </div>
    </main>
  );
}