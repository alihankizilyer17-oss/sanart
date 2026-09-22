import Link from "next/link";

export default function SellerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl p-8">

        <h1 className="text-4xl font-bold">
          Sanatçı Paneli
        </h1>

        <p className="mt-2 text-zinc-400">
          Hoş geldiniz. Buradan eserlerinizi yönetebilirsiniz.
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