const flash=require('connect-flash');
const User=require('../models/User.js');

module.exports.getsignUp=(req, res) => {
    res.render('user/signup.ejs');
};

module.exports.createAccount=async (req, res) => {
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
};

module.exports.getLogin=(req, res) => {
    res.render('user/login.ejs');
};

module.exports.Login=async (req, res) => {
    req.flash("success","Welcome to LuxeLodge! You Logged in!");
    let ru=await res.locals.redirectUrl || "/listings";
    res.redirect(ru);
};

module.exports.Logout=(req,res,next)=>{
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
};
