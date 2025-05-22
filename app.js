const express = require('express');
const ejsmate = require('ejs-mate');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const methodoverride = require('method-override');
const expresserror = require("./utils/expresserror.js");
const murl = "mongodb://127.0.0.1:27017/LuxeLodge";
const listsroutes = require("./routes/listing.js");
const reviewroutes = require("./routes/review.js");
const passport = require('passport');
const session = require('express-session');
const localStrategy = require('passport-local');
const user = require('./models/User.js');
const flash = require('connect-flash');
const userRouter = require('./routes/User.js');
const User = require('./models/User.js');

main().then(() => {
    console.log("Connected To MongoDB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(murl);
};

const sessionOptions = {
    secret: 'anshu755',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsmate);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  next();
});


app.use("/listings", listsroutes);
app.use("/listings/:id/reviews", reviewroutes);
app.use('/', userRouter);


app.get('/',(req,res)=>{
    res.render('layout/home.ejs');
})

app.get('/privacy', (req, res) => {
    res.render('Privacy&Terms/privacy.ejs', { baseUrl: 'http://localhost:8080' });
});

app.get('/terms', (req, res) => {
    res.render('Privacy&Terms/terms.ejs', { baseUrl: 'http://localhost:8080' });
});

app.all("*", (req, res, next) => {
    next(new expresserror(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

const server = app.listen(8080, () => {
    console.log("8080 is listening.....");
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('Please free the port or use a different one.');
    } else {
        console.error('Server error:', err);
    }
});