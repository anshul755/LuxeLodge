# Airbnb seed data

Raw Airbnb CSV exports live in `raw/` and are imported by `backend/init/index.js`.

Expected files:

- `raw/listings.csv`
- `raw/reviews.csv`
- `raw/calendar.csv`

The seeder currently uses `listings.csv` for LuxeLodge listings and host users, then uses
`reviews.csv` dates to create linked review documents. This reviews export does not include
comment text, so the importer creates short review comments from the matching listing data.

Run from the repository root:

```sh
npm run seed:airbnb
```

Optional limits:

```sh
SEED_LISTING_LIMIT=500 SEED_REVIEWS_PER_LISTING=5 npm run seed:airbnb
```
