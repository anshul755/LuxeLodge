const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: options.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export const api = {
  getMe: () => request("/auth/me"),
  signup: (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getListings: (q = "") => request(`/listings${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getListing: (id) => request(`/listings/${id}`),
  createListing: (payload) => request("/listings", { method: "POST", body: payload }),
  updateListing: (id, payload) => request(`/listings/${id}`, { method: "PUT", body: payload }),
  deleteListing: (id) => request(`/listings/${id}`, { method: "DELETE" }),
  createReview: (listingId, payload) =>
    request(`/listings/${listingId}/reviews`, { method: "POST", body: JSON.stringify({ review: payload }) }),
  deleteReview: (listingId, reviewId) =>
    request(`/listings/${listingId}/reviews/${reviewId}`, { method: "DELETE" }),
};
