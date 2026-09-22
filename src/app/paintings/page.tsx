import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function PaintingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-900 to-black py-10">

      <div className="mx-auto max-w-7xl px-6">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-white transition hover:bg-zinc-800"
        >
          <ArrowLeft size={20} />
          Ana Sayfaya Dön
        </Link>

        <FeaturedProducts />

      </div>

    </main>
  );
}