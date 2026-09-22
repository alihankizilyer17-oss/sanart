"use client";

import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import Hero from "../components/Hero";
import Header from "../components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <Hero />
      <Categories />

      <section className="bg-gradient-to-r from-black via-zinc-900 to-gray-800 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-6 text-6xl font-extrabold">
            Türkiye'nin En Büyük Sanat Pazarı
          </h2>

          <p className="mb-10 text-2xl">
            Binlerce sanatçının eşsiz eserlerini keşfet.
          </p>

          <button className="rounded-xl bg-orange-500 px-8 py-4 text-xl hover:bg-orange-600">
            Şimdi Keşfet
          </button>

          <FeaturedProducts />
        </div>
      </section>
    </main>
  );
}