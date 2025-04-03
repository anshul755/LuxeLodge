const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const expresserror=require("../utils/expresserror.js");
const listing=require('../models/listing.js');
const {listingschema,reviewschema}=require("../schema.js");


const validateReviewSchema=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        throw new expresserror(400,error.message);
    }else{
        next();
    }
}

//Review Form Create Function
router.post("/",validateReviewSchema,wrapAsync(async(req,res)=>{
    let listings=await listing.findById(req.params.id);
    let newReview=new Review({
        comment: req.body.review.comment,
        rating: req.body.review.rating
    });
    listings.reviews.push(newReview._id);

    await newReview.save();
    await listings.save();

    console.log("New review is saved.");
    res.redirect(`/listings/${listings._id}`);
}));

//Deleting Specific Review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports=router;