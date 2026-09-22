"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Package,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <div className="flex items-center gap-4">
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

            <p className="text-xs text-gray-400 uppercase tracking-[0.25em]">
              Original Art Marketplace
            </p>
          </div>
        </div>

        {/* Arama */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Tablo Ara..."
            className="w-58 rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-white outline-none focus:border-white"
          />
        </div>

        {/* Menü */}
        <nav className="flex gap-8">
          <a
  href="/"
  className="transition hover:text-zinc-300"
>
  Ana Sayfa
</a>
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
          <a href="#">Hakkımızda</a>
        </nav>

        {/* İkonlar */}
        <div className="flex items-center gap-5">

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
    </header>
  );
}