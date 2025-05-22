const express = require('express');
const router = express.Router();
const User=require('../models/User.js');
const wrapAsync = require('../utils/wrapAsync');
const passport=require('passport');
const flash=require('connect-flash');
const { saverurl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render('user/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        let ru=await User.register(newUser,password);
        console.log("Registered");
        req.login(ru,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to LuxeLodge!");
            res.redirect('/listings');
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get('/login', (req, res) => {
    res.render('user/login.ejs');
});

router.post('/login',saverurl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async (req, res) => {
    req.flash("success","Welcome to LuxeLodge! You Logged in!");
    let ru=await res.locals.redirectUrl || "/listings";
    res.redirect(ru);
});

router.get("/logout",(req,res,next)=>{
    if(req.isAuthenticated()){
        req.logOut((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You Logged Out Succesfully!");
            res.redirect("/listings");
        })
    }else{
        req.flash("error","You are Already Logged Out!");
        res.redirect("/listings");
    }
})

module.exports = router;
