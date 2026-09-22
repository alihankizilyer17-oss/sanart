import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-black text-white">
      {/* Sol üst gümüş parıltı */}
<div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>

{/* Sağ alt gümüş parıltı */}
<div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-zinc-300/10 blur-3xl"></div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-24">

        {/* Sol Taraf */}
        <div className="max-w-xl">

          <p className="mb-3 text-orange-400 font-semibold tracking-[0.3em] uppercase">
            Premium Art Marketplace
          </p>

          <h1 className="text-6xl font-black leading-tight">
            Türkiye'nin
            <br />
            En Büyük
            <br />
            Sanat Pazarı
          </h1>

          <p className="mt-6 text-lg text-zinc-400">
            Binlerce özgün tabloyu keşfet.
            Modern, soyut, manzara ve daha fazlası tek platformda.
          </p>

          <div className="mt-10 flex gap-4">

            <button className="rounded-xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
              Şimdi Keşfet
            </button>

            <button className="rounded-xl border border-white px-8 py-4 transition hover:bg-white hover:text-black">
              Sanatçı Ol
            </button>

          </div>

        </div>

        {/* Sağ Taraf */}
        <div>

          <Image
            src="/hero.jpg"
            alt="Hero"
            width={350}
            height={440}
            className="rounded-3xl shadow-2xl object-cover transition duration-500 hover:scale-105"
            priority
          />

        </div>

      </div>
    </section>
  );
}