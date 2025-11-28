import Image from "next/image";

export default function Gallery() {
  const images = [
    "/1.jpg",
    "/2.jpg",
    "/5.jpg",
    "/7.jpg",
    "/8.jpg",
    "/9.jpg",
  ];

  return (
    <section id="gallery" className="py-20 md:py-32 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">
            Visual Journey
          </h2>
          <p className="text-zinc-500 font-light tracking-wide uppercase">
            Glimpses of paradise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative h-80 w-full overflow-hidden group">
              <Image
                src={src}
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
