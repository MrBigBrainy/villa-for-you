import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-zinc-800">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold tracking-widest uppercase">
            Villa Pik
          </Link>
        </div>
        <div className="text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Villa Pik. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
