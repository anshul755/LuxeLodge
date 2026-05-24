import { useEffect, useState } from "react";
import { api } from "../api";
import { PageLoader } from "../components/PageLoader";
import { currency } from "../utils/formatters";

function OwnerActions({ id, ctx, onDelete }) {
  return (
    <div className="actions">
      <button onClick={() => ctx.navigate(`/listings/${id}/edit`)}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

function StarRating({ value, onChange }) {
  return (
    <div className="star-rating" role="radiogroup" aria-label="Rating">
      {[5, 4, 3, 2, 1].map((rating) => (
        <label key={rating} aria-label={`${rating} star${rating > 1 ? "s" : ""}`}>
          <input
            type="radio"
            name="rating"
            value={rating}
            checked={Number(value) === rating}
            onChange={(event) => onChange(event.target.value)}
          />
          <span aria-hidden="true">&#9733;</span>
        </label>
      ))}
    </div>
  );
}

function StarDisplay({ value }) {
  const rating = Number(value) || 0;

  return (
    <div className="star-display" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "filled" : ""} aria-hidden="true">
          &#9733;
        </span>
      ))}
    </div>
  );
}

function ReviewForm({ review, setReview, onSubmit }) {
  const updateReview = (field, value) => {
    setReview((currentReview) => ({ ...currentReview, [field]: value }));
  };

  return (
    <form className="review-form" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Your stay</p>
        <h2>Leave a Review</h2>
      </div>
      <label className="rating-field">
        <span>Rating</span>
        <StarRating value={review.rating} onChange={(value) => updateReview("rating", value)} />
      </label>
      <label>
        Comments
        <textarea
          required
          placeholder="Share what future guests should know."
          value={review.comment}
          onChange={(event) => updateReview("comment", event.target.value)}
        />
      </label>
      <button className="primary">Submit Review</button>
    </form>
  );
}

function ReviewList({ listing, user, onDeleteReview }) {
  if (!listing.reviews?.length) {
    return <p className="empty-state">No reviews yet. Be the first to share your stay.</p>;
  }

  return (
    <div className="reviews">
      {listing.reviews?.map((item) => (
        <div className="review-card" key={item._id}>
          <div className="review-card-header">
            <StarDisplay value={item.rating} />
            <span>by {item.username || "Guest"}</span>
          </div>
          <p>{item.comment}</p>
          {user && item.createdBy === user.id && (
            <button onClick={() => onDeleteReview(item._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

function ListingMap({ listing }) {
  const location = [listing.location, listing.country].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  return (
    <section className="map-section" aria-label="Listing location">
      <div>
        <p className="eyebrow">Where you'll be</p>
        <h2>{location}</h2>
      </div>
      <iframe title={`Map of ${location}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </section>
  );
}

export function ListingDetails({ ctx, id }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 3, comment: "" });

  const refresh = () =>
    api.getListing(id).then(({ listing }) => {
      setListing(listing);
      return listing;
    });

  useEffect(() => {
    let active = true;

    setLoading(true);
    api
      .getListing(id)
      .then(({ listing }) => {
        if (active) setListing(listing);
      })
      .catch((err) => {
        if (active) ctx.setNotice(err.message, "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (!listing) return <PageLoader label="Preparing your lodge..." variant="detail" />;

  const isOwner = ctx.user && listing.owner?._id === ctx.user.id;

  const submitReview = async (event) => {
    event.preventDefault();
    await api.createReview(id, review);
    setReview({ rating: 3, comment: "" });
    ctx.setNotice("Review added.");
    setLoading(true);
    try {
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async () => {
    await api.deleteListing(id);
    ctx.navigate("/listings", "Listing deleted.");
  };

  const deleteReview = async (reviewId) => {
    await api.deleteReview(id, reviewId);
    setLoading(true);
    try {
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className={`detail transition duration-300 ease-out ${
        loading ? "opacity-70" : "opacity-100"
      }`}
    >
      {loading && (
        <div className="fixed left-1/2 top-24 z-40 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-amber-200 bg-white/95 px-4 py-2 text-sm font-extrabold text-neutral-800 shadow-xl shadow-black/10 backdrop-blur">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          Refreshing stay
        </div>
      )}
      <section className="detail-hero">
        <div className="detail-copy">
          <p className="eyebrow">LuxeLodge stay</p>
          <h1>{listing.title}</h1>
          <p>{listing.description}</p>
          <div className="detail-meta">
            <span>Hosted by {listing.owner?.username || "LuxeLodge host"}</span>
            <span>{listing.location}, {listing.country}</span>
          </div>
          <p className="price-line">₹{currency.format(listing.price || 0)} <span>/ night</span></p>
          {isOwner && <OwnerActions id={id} ctx={ctx} onDelete={deleteListing} />}
        </div>
        <img className="detail-image" src={listing.image?.url} alt={listing.title} />
      </section>
      <ListingMap listing={listing} />
      {ctx.user && (
        <ReviewForm review={review} setReview={setReview} onSubmit={submitReview} />
      )}
      <section className="reviews-section">
        <div className="section-heading">
          <p className="eyebrow">Guest notes</p>
          <h2>All Reviews</h2>
        </div>
        <ReviewList listing={listing} user={ctx.user} onDeleteReview={deleteReview} />
      </section>
    </article>
  );
}
