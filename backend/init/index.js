if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
}

const path = require("path");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/User.js");
const { readCsv } = require("./csv.js");

const mongoUrl = process.env.mongo_url || "mongodb://127.0.0.1:27017/LuxeLodge";
const dataDir = path.join(__dirname, "..", "data", "airbnb", "raw");
const listingsPath = path.join(dataDir, "listings.csv");
const reviewsPath = path.join(dataDir, "reviews.csv");

const listingLimit = Number(process.env.SEED_LISTING_LIMIT || 300);
const reviewsPerListing = Number(process.env.SEED_REVIEWS_PER_LISTING || 3);
const seedPassword = process.env.SEED_USER_PASSWORD || "seed-password";
const seedEmailDomain = "seed.luxelodge.local";
const fallbackImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

function cleanText(value, fallback) {
  if (!value) return fallback;

  const cleaned = value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || fallback;
}

function parsePrice(value, row) {
  const usd = Number(String(value || "").replace(/[$,]/g, ""));

  if (Number.isFinite(usd) && usd > 0) {
    return Math.round(usd * 83);
  }

  const accommodates = Number(row.accommodates || 2);
  const bedrooms = Number(row.bedrooms || 1);
  return Math.round(4500 + accommodates * 1100 + bedrooms * 1800);
}

function parseRating(value) {
  const score = Number(value);

  if (!Number.isFinite(score) || score <= 0) return 4;
  if (score <= 5) return Math.min(5, Math.max(1, Math.round(score)));
  return Math.min(5, Math.max(1, Math.round(score / 20)));
}

function hostUsername(row, index) {
  const hostName = cleanText(row.host_name, "airbnb host").toLowerCase();
  const base = hostName.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "host";
  return `seed_${base}_${row.host_id || index}`;
}

function createReviewComment(row, listingRow, rating) {
  if (row.comments) return cleanText(row.comments, "A comfortable stay with a helpful host.");

  const title = cleanText(listingRow.name, "this stay");
  const location = cleanText(
    listingRow.neighbourhood_cleansed || listingRow.neighbourhood || listingRow.host_location,
    "the area",
  );

  if (rating >= 5) return `Loved ${title}. The stay felt clean, comfortable, and well located near ${location}.`;
  if (rating === 4) return `${title} was a pleasant stay with a responsive host and a convenient location.`;
  return `${title} worked well for the trip and had the essentials for a short stay.`;
}

function mapListing(row, owner, index) {
  const location = cleanText(
    row.neighbourhood_cleansed || row.neighbourhood || row.host_location,
    "Albany",
  );

  return {
    title: cleanText(row.name, `Airbnb stay ${row.id || index + 1}`),
    description: cleanText(
      row.description || row.neighborhood_overview,
      "A comfortable real-world Airbnb stay imported for LuxeLodge.",
    ),
    image: {
      url: row.picture_url || fallbackImage,
      filename: `airbnb-${row.id || index}`,
    },
    price: parsePrice(row.price, row),
    location,
    country: "United States",
    owner: owner._id,
    reviews: [],
  };
}

async function createSeedHost(row, index, hostCache) {
  const hostId = row.host_id || `unknown_${index}`;

  if (hostCache.has(hostId)) return hostCache.get(hostId);

  const username = hostUsername(row, index);
  const email = `${username}@${seedEmailDomain}`;
  const user = new User({ email, username });
  const registeredUser = await new Promise((resolve, reject) => {
    User.register(user, seedPassword, (err, account) => {
      if (err) return reject(err);
      resolve(account);
    });
  });

  hostCache.set(hostId, registeredUser);
  return registeredUser;
}

async function seedAirbnbData() {
  console.log("Reading Airbnb CSV files...");
  const listingRows = readCsv(listingsPath)
    .filter((row) => row.id && row.name)
    .slice(0, listingLimit);
  const reviewRows = readCsv(reviewsPath);

  console.log("Clearing previous LuxeLodge seed data...");
  await Listing.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({ email: new RegExp(`@${seedEmailDomain.replace(/\./g, "\\.")}$`) });

  const hostCache = new Map();
  const listingDocuments = [];
  const originalListingsByExternalId = new Map();

  for (const [index, row] of listingRows.entries()) {
    const owner = await createSeedHost(row, index, hostCache);
    listingDocuments.push(mapListing(row, owner, index));
    originalListingsByExternalId.set(row.id, row);
  }

  const insertedListings = await Listing.insertMany(listingDocuments);
  const listingsByExternalId = new Map();

  listingRows.forEach((row, index) => {
    listingsByExternalId.set(row.id, insertedListings[index]);
  });

  const reviewCounts = new Map();
  const reviewDocuments = [];

  for (const row of reviewRows) {
    const listing = listingsByExternalId.get(row.listing_id);
    if (!listing) continue;

    const currentCount = reviewCounts.get(row.listing_id) || 0;
    if (currentCount >= reviewsPerListing) continue;

    const listingRow = originalListingsByExternalId.get(row.listing_id);
    const rating = parseRating(listingRow.review_scores_rating);

    reviewDocuments.push({
      rating,
      comment: createReviewComment(row, listingRow, rating),
      createdAt: row.date ? new Date(row.date) : new Date(),
      username: row.reviewer_name || `Airbnb guest ${currentCount + 1}`,
      createdBy: listing.owner,
      listingId: listing._id,
    });
    reviewCounts.set(row.listing_id, currentCount + 1);
  }

  const insertedReviews = await Review.insertMany(
    reviewDocuments.map(({ listingId, ...review }) => review),
  );

  const listingReviewIds = new Map();
  reviewDocuments.forEach((review, index) => {
    const key = String(review.listingId);
    const ids = listingReviewIds.get(key) || [];
    ids.push(insertedReviews[index]._id);
    listingReviewIds.set(key, ids);
  });

  if (listingReviewIds.size > 0) {
    await Listing.bulkWrite(
      [...listingReviewIds.entries()].map(([listingId, reviewIds]) => ({
        updateOne: {
          filter: { _id: listingId },
          update: { $set: { reviews: reviewIds } },
        },
      })),
    );
  }

  console.log(`Seeded ${insertedListings.length} listings.`);
  console.log(`Seeded ${hostCache.size} hosts.`);
  console.log(`Seeded ${insertedReviews.length} reviews.`);
}

mongoose
  .connect(mongoUrl)
  .then(seedAirbnbData)
  .then(() => {
    console.log("Airbnb seed completed.");
    return mongoose.disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  });
