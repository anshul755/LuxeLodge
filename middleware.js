module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl || "/listings";
        req.flash("error","You must be Logged in to Create Listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saverurl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}