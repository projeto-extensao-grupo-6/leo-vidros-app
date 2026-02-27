export default function SkeletonLoader({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full animate-pulse rounded-lg border border-slate-200 bg-white p-4 md:p-5"
        >
          {/* Header */}
          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-md bg-slate-200 p-2"></div>
              <div className="flex-1">
                <div className="mb-2 h-5 w-32 rounded bg-slate-200"></div>
                <div className="h-3 w-24 rounded bg-slate-100"></div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-end md:self-auto">
              <div className="h-6 w-20 rounded-2xl bg-slate-200"></div>
              <div className="mx-1 h-4 w-px bg-slate-300"></div>
              <div className="h-9 w-9 rounded-full bg-slate-200"></div>
              <div className="h-9 w-9 rounded-full bg-slate-200"></div>
              <div className="h-9 w-9 rounded-full bg-slate-200"></div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 gap-4 text-sm lg:grid-cols-12">
            {/* Coluna 1 */}
            <div className="lg:col-span-3">
              <div className="mb-2 h-3 w-16 rounded bg-slate-200"></div>
              <div className="h-4 w-full rounded bg-slate-100"></div>
            </div>

            {/* Coluna 2 */}
            <div className="lg:col-span-4">
              <div className="mb-2 h-3 w-20 rounded bg-slate-200"></div>
              <div className="mb-1 h-4 w-full rounded bg-slate-100"></div>
              <div className="h-4 w-3/4 rounded bg-slate-100"></div>
            </div>

            {/* Coluna 3 */}
            <div className="lg:col-span-3">
              <div className="mb-2 h-3 w-20 rounded bg-slate-200"></div>
              <div className="h-4 w-full rounded bg-slate-100"></div>
            </div>

            {/* Coluna 4 - Progress or Value */}
            <div className="lg:col-span-2">
              <div className="mb-2 h-3 w-24 rounded bg-slate-200"></div>
              <div className="h-2.5 w-full rounded bg-slate-100"></div>
              <div className="mt-1 h-2 w-12 rounded bg-slate-100"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
