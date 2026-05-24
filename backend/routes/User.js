const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport=require('passport');

const { saverurl } = require('../middleware.js');
const authController=require('../controllers/User.js');

router.get("/me",(req,res)=>{
    if(!req.user){
        return res.json({ user:null });
    }

    res.json({ user:{ id:req.user._id, username:req.user.username, email:req.user.email } });
});

router.post("/signup",wrapAsync(authController.createAccount));

router.post("/login",saverurl,(req,res,next)=>{
    passport.authenticate("local",(err,user,info)=>{
        if(err){
            return next(err);
        }

        if(!user){
            return res.status(401).json({ error:info?.message || "Invalid username or password." });
        }

        req.logIn(user,(loginErr)=>{
            if(loginErr){
                return next(loginErr);
            }

            return authController.Login(req,res,next);
        });
    })(req,res,next);
});

router.post("/logout",authController.Logout)

module.exports = router;
