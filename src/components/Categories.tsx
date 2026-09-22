import Image from "next/image";

export default function Categories() {
  
    const categories = [
  { name: "Modern", image: "/categories/modern.jpg" },
  { name: "Soyut", image: "/categories/soyut.jpg" },
  { name: "Manzara", image: "/categories/manzara.jpg" },
  { name: "Portre", image: "/categories/portre2.jpg" },
  { name: "Minimal", image: "/categories/minimal.jpg" },
  { name: "Klasik", image: "/categories/klasik.jpg" },
];
  

  return (
    <section className="bg-black py-16">
      <div className="mx-auto max-w-7xl px-8">

        <h2 className="mb-10 text-center text-4xl font-bold text-white">
          Kategoriler
        </h2>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {categories.map((category) => (
            <div
              key={category.name}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-zinc-300 hover:shadow-2xl"
            >
             <Image
  src={category.image}
  alt={category.name}
  width={250}
  height={250}
  className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
/>

<h3 className="mt-4 text-xl font-bold">
  {category.name}
</h3>

<p className="mt-2 text-sm text-zinc-400 transition group-hover:text-white">
  Keşfet →
</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}