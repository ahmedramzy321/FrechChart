export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between shadow-xs">
      <div>
        <Skeleton className="w-full h-52 mb-4 rounded-xl" />
        <Skeleton className="w-20 h-3 mb-2" />
        <Skeleton className="w-3/4 h-5 mb-2" />
        <Skeleton className="w-1/2 h-4 mb-4" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-16 h-5" />
          <Skeleton className="w-12 h-5" />
        </div>
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center p-3 text-center">
      <Skeleton className="w-24 h-24 rounded-2xl mb-3" />
      <Skeleton className="w-16 h-4" />
    </div>
  );
}
