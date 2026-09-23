"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Package,
  Menu,
  X,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="w-full overflow-x-hidden bg-black text-white shadow-lg">
      {/* ================= DESKTOP ================= */}
      <div className="mx-auto hidden max-w-screen-2xl items-center justify-between gap-6 px-6 py-5 lg:flex">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-4">
          <Image
            src="/logo.png"
            alt="SanArt Logo"
            width={70}
            height={70}
            priority
          />

          <div>
            <h1 className="text-3xl font-bold tracking-wider">
              SANART
            </h1>

            <p className="whitespace-nowrap text-xs uppercase tracking-[0.25em] text-gray-400">
              Original Art Marketplace
            </p>
          </div>
        </Link>

        {/* Arama */}
        <div className="relative w-64 shrink-0">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Tablo Ara..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-white outline-none transition focus:border-white"
          />
        </div>

        {/* Menü */}
        <nav className="flex shrink-0 items-center gap-6 whitespace-nowrap">
          <Link
            href="/"
            className="transition hover:text-zinc-300"
          >
            Ana Sayfa
          </Link>

          <Link
            href="/paintings"
            className="transition hover:text-zinc-300"
          >
            Tablolar
          </Link>

          <Link
            href="/artist"
            className="transition hover:text-zinc-300"
          >
            Sanatçılar
          </Link>

          <a
            href="#"
            className="transition hover:text-zinc-300"
          >
            Hakkımızda
          </a>
        </nav>

        {/* İkonlar */}
        <div className="flex shrink-0 items-center gap-5">

          <Link href="/favorites">
            <Heart
              size={24}
              className="cursor-pointer transition hover:text-red-500"
            />
          </Link>

          <Link href="/cart">
            <ShoppingCart
              size={24}
              className="cursor-pointer transition hover:text-zinc-300"
            />
          </Link>

          <Link href="/orders">
            <Package
              size={24}
              className="cursor-pointer transition hover:text-zinc-300"
            />
          </Link>

          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 transition hover:bg-zinc-800"
            >
              <User size={22} />
              <span>Hesabım</span>
            </Link>
          ) : (
            <Link href="/account">
              <User
                size={24}
                className="cursor-pointer transition hover:text-zinc-300"
              />
            </Link>
          )}

        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="lg:hidden">

        {/* Üst mobil bar */}
        <div className="flex items-center justify-between px-4 py-4">

          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt="SanArt Logo"
              width={48}
              height={48}
              priority
            />

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-wider">
                SANART
              </h1>

              <p className="truncate text-[9px] uppercase tracking-[0.18em] text-gray-400">
                Original Art Marketplace
              </p>
            </div>
          </Link>

          {/* Mobil sağ taraf */}
          <div className="flex shrink-0 items-center gap-3">

            <Link href="/favorites">
              <Heart
                size={21}
                className="transition hover:text-red-500"
              />
            </Link>

            <Link href="/cart">
              <ShoppingCart
                size={21}
                className="transition hover:text-zinc-300"
              />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg bg-zinc-900 p-2 transition hover:bg-zinc-800"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

          </div>
        </div>

        {/* Mobil arama */}
        <div className="px-4 pb-4">
          <div className="relative w-full">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Tablo Ara..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-white"
            />
          </div>
        </div>

        {/* Mobil menü */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-5">

            <nav className="flex flex-col">

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-zinc-800 py-4 text-base transition hover:text-zinc-400"
              >
                Ana Sayfa
              </Link>

              <Link
                href="/paintings"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-zinc-800 py-4 text-base transition hover:text-zinc-400"
              >
                Tablolar
              </Link>

              <Link
                href="/artist"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-zinc-800 py-4 text-base transition hover:text-zinc-400"
              >
                Sanatçılar
              </Link>

              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-zinc-800 py-4 text-base transition hover:text-zinc-400"
              >
                Hakkımızda
              </a>

              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 border-b border-zinc-800 py-4 text-base transition hover:text-zinc-400"
              >
                <Package size={19} />
                Siparişler
              </Link>

              <Link
                href="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 border-b border-zinc-800 py-4 text-base transition hover:text-red-500"
              >
                <Heart size={19} />
                Favoriler
              </Link>

              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-4 text-base transition hover:text-zinc-400"
              >
                <User size={19} />
                {user ? "Hesabım" : "Giriş Yap"}
              </Link>

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}