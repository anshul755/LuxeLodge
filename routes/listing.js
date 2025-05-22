const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing=require('../models/listing.js');
const expresserror=require("../utils/expresserror.js");
const {listingschema,reviewschema}=require("../schema.js");
const flash=require("connect-flash");
const {isLoggedIn}=require('../middleware.js');

const validateListingSchema=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let ermessage=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,ermessage);
    }else{
        next();
    }
}

//Index Route main route default 
router.get("/",wrapAsync(async (req,res)=>{
    const all_listing=await listing.find({});
    res.render("listings/index.ejs",{all_listing});
}));

//New Route new post mata
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
});

//Show Route id throught jose
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id).populate("reviews").populate("owner");
    if(!listings){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listings,res});
}));

//Create Route
router.post("/",validateListingSchema,wrapAsync(async(req,res,next)=>{
    const nlisting=new listing(req.body.listing);
    nlisting.owner=req.user._id;
    await nlisting.save();
    req.flash("success","New Listing Added!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.render("listings/edit.ejs",{listings});
}));

//Update Route
router.put("/:id",isLoggedIn,validateListingSchema,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;