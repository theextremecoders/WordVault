export function Loader() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Word header skeleton */}
      <div className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body gap-5">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="h-12 w-48 bg-base-300 rounded-xl" />
              <div className="h-5 w-32 bg-base-300 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-base-300 rounded-lg" />
              <div className="h-8 w-20 bg-base-300 rounded-lg" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-5 w-24 bg-base-300 rounded-full" />
            <div className="h-5 w-28 bg-base-300 rounded-full" />
          </div>

          <div className="divider my-0" />

          {/* Meaning skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 bg-base-300 rounded-full" />
                <div className="flex-1 h-px bg-base-300" />
              </div>
              <div className="space-y-2 pl-8">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-base-300 rounded" style={{ width: `${70 + j * 8}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
