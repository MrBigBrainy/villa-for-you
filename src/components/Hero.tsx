import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/6.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 animate-fade-in-up">
          A Collection of <br /> Exquisite Residences
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mb-10 animate-fade-in-up delay-100">
          Discover our curated portfolio of luxury villas, each offering a unique sanctuary of comfort and style.
        </p>
        <Link
          href="#residences"
          className="px-8 py-4 bg-white text-zinc-900 text-sm font-bold tracking-widest uppercase hover:bg-zinc-100 transition-colors animate-fade-in-up delay-200 rounded-full"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
