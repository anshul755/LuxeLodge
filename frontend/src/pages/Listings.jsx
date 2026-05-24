import { useEffect, useState } from "react";
import { api } from "../api";
import { PageLoader } from "../components/PageLoader";
import { currency } from "../utils/formatters";

function ListingCard({ listing, navigate }) {
  return (
    <button className="listing-card" onClick={() => navigate(`/listings/${listing._id}`)}>
      <img src={listing.image?.url} alt={listing.title} loading="lazy" decoding="async" />
      <strong>{listing.title}</strong>
      <span>₹{currency.format(listing.price || 0)} / night</span>
    </button>
  );
}

export function Listings({ q, navigate }) {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState(q);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setSearch(q);
    setLoading(true);
    api
      .getListings(q)
      .then(({ listings }) => {
        if (active) setListings(listings);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [q]);

  const submit = (event) => {
    event.preventDefault();
    navigate(`/listings${search ? `?q=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <>
      <form className="search" onSubmit={submit}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search here"
        />
        <button className="primary">Search</button>
      </form>
      {loading && listings.length === 0 ? (
        <PageLoader label="Finding beautiful lodges..." variant="listings" />
      ) : (
        <div className="relative">
          {loading && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-neutral-800 shadow-xl shadow-black/10 backdrop-blur">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                Updating lodges
              </div>
            </div>
          )}
          <div
            className={`listing-grid transition duration-300 ease-out ${
              loading ? "opacity-60 blur-[1px]" : "opacity-100 blur-0"
            }`}
          >
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
