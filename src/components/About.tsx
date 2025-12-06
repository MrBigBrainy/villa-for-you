import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Image */}
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[600px]">
            <Image
              src="/3.jpg"
              alt="Villa Interior"
              fill
              className="object-cover shadow-xl"
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-zinc-900">
              A Sanctuary for the Senses
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-6 text-lg font-light">
              Villa is more than just a residence; it is a masterpiece of design and comfort. Nestled in a secluded paradise, our villa offers an unparalleled blend of modern luxury and natural beauty.
            </p>
            <p className="text-zinc-600 leading-relaxed mb-8 text-lg font-light">
              Every detail has been meticulously crafted to ensure your stay is nothing short of perfection. From the expansive living spaces to the private infinity pool, every moment here is a memory in the making.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="text-3xl font-serif text-zinc-900 mb-2">5</h4>
                <p className="text-sm uppercase tracking-widest text-zinc-500">Bedrooms</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-zinc-900 mb-2">6</h4>
                <p className="text-sm uppercase tracking-widest text-zinc-500">Bathrooms</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-zinc-900 mb-2">450</h4>
                <p className="text-sm uppercase tracking-widest text-zinc-500">Sq Meters</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-zinc-900 mb-2">∞</h4>
                <p className="text-sm uppercase tracking-widest text-zinc-500">Pool View</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
