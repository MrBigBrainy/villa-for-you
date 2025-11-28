import { Waves, Smartphone, ChefHat, Trees, Film, UserCheck } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Infinity Pool",
      description: "A stunning private pool overlooking the horizon, perfect for morning laps or sunset relaxation.",
      icon: Waves,
    },
    {
      title: "Smart Home",
      description: "Integrated smart systems for lighting, climate, and entertainment at your fingertips.",
      icon: Smartphone,
    },
    {
      title: "Gourmet Kitchen",
      description: "Fully equipped chef's kitchen with top-of-the-line appliances and spacious island.",
      icon: ChefHat,
    },
    {
      title: "Private Garden",
      description: "Lush, manicured gardens providing privacy and a serene connection with nature.",
      icon: Trees,
    },
    {
      title: "Home Cinema",
      description: "State-of-the-art projection system and surround sound for the ultimate movie night.",
      icon: Film,
    },
    {
      title: "Concierge Service",
      description: "24/7 dedicated concierge to assist with reservations, transport, and any requests.",
      icon: UserCheck,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 border border-zinc-100 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 inline-block p-4 bg-zinc-50 group-hover:bg-zinc-900 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-zinc-900 group-hover:text-white transition-colors duration-300" />
              </div>
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
