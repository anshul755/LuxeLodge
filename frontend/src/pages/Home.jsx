import { Aurora } from "../components/Aurora";

const quickFilters = [
  { label: "Top rated", path: "/listings?sort=rating_desc" },
  { label: "Nearby stays", path: "/listings" },
  { label: "Best value", path: "/listings?sort=price_asc" },
];

const highlights = [
  ["300+", "real stays"],
  ["800+", "guest reviews"],
  ["6", "smart filters"],
];

export function Home({ navigate }) {
  return (
    <section className="relative grid min-h-[calc(100svh-96px)] overflow-hidden rounded-none bg-neutral-950 text-white">
      <Aurora
        className="absolute inset-0"
        colorStops={["#8b5e11", "#f6d36b", "#c69214"]}
        amplitude={1.1}
        blend={0.9}
        speed={1.5}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%),linear-gradient(135deg,rgba(5,5,5,0.38),rgba(5,5,5,0.8))]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-96px)] w-full max-w-[1320px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex items-center px-5 py-10 sm:px-8 lg:px-14">
          <div className="grid w-full max-w-2xl gap-6">
            <div className="flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold text-white shadow-lg shadow-black/10 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Curated stays with real travel data
            </div>
            <div className="grid gap-4">
              <h1 className="m-0 text-5xl font-black leading-none tracking-normal text-white sm:text-6xl lg:text-7xl">
                Stay somewhere that already feels chosen.
              </h1>
              <p className="m-0 max-w-xl text-base font-semibold leading-7 text-neutral-200 sm:text-lg">
                Browse beautiful lodges, compare prices, filter by amenities, and discover places
                worth booking without the usual clutter.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-black text-neutral-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-1 hover:bg-amber-300"
                onClick={() => navigate("/listings")}
              >
                Explore stays
              </button>
              <button
                className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/16"
                onClick={() => navigate("/signup")}
              >
                Create account
              </button>
            </div>
            <div className="grid gap-3 rounded-lg border border-white/15 bg-white/10 p-4 shadow-xl shadow-black/20 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong className="text-sm font-black uppercase text-white">Start faster</strong>
                <span className="text-xs font-bold uppercase text-amber-200">Popular picks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((item) => (
                  <button
                    key={item.label}
                    className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white/15"
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/15 bg-white/10 px-4 py-4 shadow-lg shadow-black/20 backdrop-blur-md"
                >
                  <strong className="block text-3xl font-black text-white">{value}</strong>
                  <span className="text-sm font-bold text-neutral-200">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative hidden items-center px-6 py-8 lg:flex">
          <div className="ml-auto grid max-w-md gap-4 rounded-lg border border-white/15 bg-white/10 p-5 text-white shadow-2xl shadow-black/30 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-black uppercase text-amber-200">Featured tonight</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold">From ₹9,800</span>
            </div>
            <div className="grid gap-2">
              <strong className="text-3xl font-black leading-tight">
                Warm design, quiet mornings, great location.
              </strong>
              <p className="m-0 max-w-md text-sm font-semibold leading-6 text-neutral-100">
                Filter faster, compare cleaner, and move from browsing to booking mood in a few clicks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-extrabold uppercase text-white/90">
              <span className="rounded-full border border-white/20 px-3 py-1">Wifi</span>
              <span className="rounded-full border border-white/20 px-3 py-1">Kitchen</span>
              <span className="rounded-full border border-white/20 px-3 py-1">Top rated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
