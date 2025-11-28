export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-zinc-900 mb-4"></div>
        <p className="text-lg font-serif text-zinc-900">Loading Villa Pik...</p>
      </div>
    </div>
  );
}
