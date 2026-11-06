export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 gap-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
      </div>
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
}
