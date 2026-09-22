import Link from "next/link";
export default function AccountPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-10 shadow-2xl">

        <h1 className="text-center text-4xl font-bold text-white">
          SanArt
        </h1>

        <p className="mt-3 text-center text-zinc-400">
          Hesabınıza giriş yapın
        </p>

        <Link
  href="/login"
  className="mt-8 block w-full rounded-xl bg-white py-3 text-center font-semibold text-black hover:bg-zinc-200"
>
  Giriş Yap
</Link>

        <Link
  href="/register"
  className="mt-4 block w-full rounded-xl border border-white py-3 text-center font-semibold text-white hover:bg-white hover:text-black"
>
  Kayıt Ol
</Link>
        <div className="my-8 border-t border-zinc-700"></div>

        <p className="text-center text-zinc-400">
          Sanatçı mısınız?
        </p>

       <Link
  href="/seller"
  className="mt-4 block w-full rounded-xl border border-zinc-600 py-3 text-center text-white transition hover:border-white hover:bg-zinc-800"
>
  🎨 Sanatçı Paneline Git
</Link>

      </div>
    </main>
  );
}