function ListingSkeletons() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-lg bg-white shadow-xl shadow-black/10 transition"
          style={{ animationDelay: `${item * 80}ms` }}
        >
          <div className="h-56 animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200" />
          <div className="grid gap-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]" aria-hidden="true">
      <div className="grid content-center gap-4">
        <div className="h-3 w-32 animate-pulse rounded-full bg-amber-200" />
        <div className="h-14 w-4/5 animate-pulse rounded-lg bg-neutral-200" />
        <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-neutral-200" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-neutral-200" />
        <div className="flex gap-3">
          <div className="h-9 w-32 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-9 w-40 animate-pulse rounded-full bg-neutral-200" />
        </div>
      </div>
      <div className="min-h-80 animate-pulse rounded-lg bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 shadow-2xl shadow-black/10" />
    </div>
  );
}

export function PageLoader({ label = "Loading", variant = "page" }) {
  return (
    <section
      className="grid translate-y-0 gap-8 py-6 opacity-100 transition duration-300 ease-out"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex w-fit items-center gap-3 rounded-lg border border-amber-200 bg-white px-5 py-3 shadow-xl shadow-black/10">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <span className="text-sm font-extrabold text-neutral-800">{label}</span>
      </div>
      {variant === "listings" ? <ListingSkeletons /> : <DetailSkeleton />}
    </section>
  );
}
