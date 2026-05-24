if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
}

const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const expresserror = require("./utils/expresserror.js");
const listsroutes = require("./routes/listing.js");
const reviewroutes = require("./routes/review.js");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const localStrategy = require("passport-local");
const user = require("./models/User.js");
const userRouter = require("./routes/User.js");

const PORT = process.env.PORT || 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const murl = process.env.mongo_url;

main()
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(murl);
}

const store = MongoStore.create({
  mongoUrl: murl,
  crypto: {
    secret: process.env.Secret,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("Error Occured in Mongo Session Store");
});

const sessionOptions = {
  store,
  secret: process.env.Secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
    sameSite: "lax",
  },
};

app.use((req, res, next) => {
  const allowedOrigins = [CLIENT_ORIGIN, "http://localhost:5173"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use("/api/listings", listsroutes);
app.use("/api/listings/:id/reviews", reviewroutes);
app.use("/api/auth", userRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const frontendDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(new expresserror(404, "API route not found"));
  }

  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) {
      next(new expresserror(404, "Build the frontend before serving production assets."));
    }
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).json({ error: message });
});

const server = app.listen(PORT, () => {
  console.log(`${PORT} is listening.....`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("Please free the port or use a different one.");
  } else {
    console.error("Server error:", err);
  }
});
