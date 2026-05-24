# LuxeLodge

Experience LuxeLodge in action: [LuxeLodge](https://luxelodge.onrender.com/)

LuxeLodge is a full-stack stay discovery app inspired by modern vacation rental platforms. The project has been updated from a server-rendered EJS application into a client/server architecture with a React + Vite frontend and an Express + MongoDB backend. It now supports authenticated listing management, review workflows, image uploads, and seeded travel data.

## Quickstart Guide

### Clone the repository

```bash
git clone https://github.com/anshul755/LuxeLodge.git
cd LuxeLodge
```

### Install dependencies

```bash
npm run install:all
```

### Set up environment variables

Create a `.env` file at the project root and add the backend and Cloudinary values:

```env
mongo_url=your-mongodb-connection-string
Secret=your-session-secret
Cloud_name=your-cloudinary-cloud-name
Cloud_api_key=your-cloudinary-api-key
Cloud_api_secret=your-cloudinary-api-secret
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=
PORT=8080
```

If `VITE_API_URL` is omitted, the frontend uses `/api` by default.

### Start the application in development

Run the backend API in one terminal:

```bash
npm run dev:backend
```

Run the frontend in another terminal:

```bash
npm run dev:frontend
```

The Vite server runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:8080`.

### Build for production

```bash
npm run build
npm start
```

After the frontend is built, the backend serves `frontend/dist` for non-API routes.

## Features

- Curated landing page with a polished hero section, quick filters, and key stats.
- Searchable listings grid with query support and responsive card layout.
- Listing detail pages with full descriptions, price display, host info, location map, and review threads.
- Auth flow with sign up, log in, log out, and current-user session detection.
- Create, edit, and delete listings with image upload support through Cloudinary.
- Add and remove reviews on individual listings.
- Owner-only actions for editing and deleting a listing.
- Privacy and terms pages for basic legal navigation.
- Production mode that serves the built frontend from the backend server.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, OGL.
- Backend: Node.js, Express, MongoDB, Mongoose, Passport, express-session.
- Media storage: Cloudinary via multer-storage-cloudinary.
- Validation: Joi.

## Project Structure

```text
LuxeLodge/
├── frontend/        React application built with Vite
├── backend/         Express API, auth, models, Cloudinary upload handling, seed scripts
├── package.json     Root orchestrator scripts for the two apps
└── README.md        Project documentation
```

## API Overview

### Health Check

- `GET /api/health`

### Listings

- `GET /api/listings`
- `GET /api/listings/:id`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`

The listings index supports search with `q`, and the data layer also supports paging and location-based sorting.

### Reviews

- `POST /api/listings/:id/reviews`
- `DELETE /api/listings/:id/reviews/:reviewId`

### Auth

- `GET /api/auth/me`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## Seed Data

The repo includes Airbnb CSV data under `backend/data/airbnb/raw/`. The seeder reads `listings.csv` and `reviews.csv`, creates host users, and generates review records linked to the imported listings.

Run the importer from the repository root:

```bash
npm run seed:airbnb
```

You can limit the import size with environment variables:

```bash
SEED_LISTING_LIMIT=500 SEED_REVIEWS_PER_LISTING=5 npm run seed:airbnb
```

## Notes

- Listing creation and editing require authentication.
- Images are uploaded to Cloudinary and stored with each listing.
- Reviews are tied to a specific listing and can be removed by their author.
- The frontend keeps session state by calling `/api/auth/me` on load and sends credentials with every API request.

## Future Improvements

Planned enhancements for the next iterations:

- More advanced filters for price, location, and amenities.
- Better booking and reservation workflows.
- Notifications and saved listings.
- Admin or host dashboards for managing inventory.
- Incremental service extraction if the backend grows beyond a modular monolith.

## Contributors

Made with passion by:

- [Anshul Patel](https://github.com/anshul755)
- [Jainil Patel](https://github.com/JainilPatel2502)

Contributions are welcome. Feel free to fork the repo and submit a PR for improvements or bug fixes.
