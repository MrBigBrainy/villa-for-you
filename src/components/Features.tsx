export default function Features() {
  const features = [
    {
      title: "Infinity Pool",
      description: "A stunning private pool overlooking the horizon, perfect for morning laps or sunset relaxation.",
    },
    {
      title: "Smart Home",
      description: "Integrated smart systems for lighting, climate, and entertainment at your fingertips.",
    },
    {
      title: "Gourmet Kitchen",
      description: "Fully equipped chef's kitchen with top-of-the-line appliances and spacious island.",
    },
    {
      title: "Private Garden",
      description: "Lush, manicured gardens providing privacy and a serene connection with nature.",
    },
    {
      title: "Home Cinema",
      description: "State-of-the-art projection system and surround sound for the ultimate movie night.",
    },
    {
      title: "Concierge Service",
      description: "24/7 dedicated concierge to assist with reservations, transport, and any requests.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">
            Unrivaled Amenities
          </h2>
          <p className="text-zinc-500 font-light tracking-wide uppercase">
            Designed for your comfort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="p-8 border border-zinc-100 hover:border-zinc-300 transition-colors duration-300">
              <h3 className="text-2xl font-serif text-zinc-900 mb-4">{feature.title}</h3>
              <p className="text-zinc-600 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
