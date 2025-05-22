const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const expresserror=require("../utils/expresserror.js");
const listing=require('../models/listing.js');
const User=require('../models/User.js');
const {listingschema,reviewschema}=require("../schema.js");
const {isLoggedIn}=require('../middleware.js');

const validateReviewSchema=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        throw new expresserror(400,error.message);
    }else{
        next();
    }
}

//Review Form Create Function
router.post("/",isLoggedIn,validateReviewSchema,wrapAsync(async(req,res)=>{
    const user = await User.findById(req.user._id);
    let listings=await listing.findById(req.params.id);
    let newReview=new Review({
        comment: req.body.review.comment,
        rating: req.body.review.rating,
        username:user.username,
        createdBy:user._id
    });
    listings.reviews.push(newReview._id);

    await newReview.save();
    await listings.save();
    req.flash("success","Review Added!");
    console.log("New review is saved.");
    res.redirect(`/listings/${listings._id}`);
}));

//Deleting Specific Review
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));


module.exports=router;