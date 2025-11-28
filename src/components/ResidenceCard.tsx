import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { Residence } from "@/data/residences";

export default function ResidenceCard({ residence }: { residence: Residence }) {
  return (
    <Link href={`/residences/${residence.id}`} className="group block">
      <div className="bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-zinc-100">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={residence.image}
            alt={residence.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
            {residence.price}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-zinc-500 text-xs font-medium tracking-wide uppercase mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            {residence.location}
          </div>
          <h3 className="text-xl font-serif text-zinc-900 mb-3 group-hover:text-zinc-600 transition-colors">
            {residence.name}
          </h3>
          <div className="flex items-center justify-between text-zinc-500 text-sm border-t border-zinc-100 pt-4 mt-4">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{residence.features.beds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{residence.features.baths} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{residence.features.sqft} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
