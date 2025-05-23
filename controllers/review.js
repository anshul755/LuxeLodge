const User=require('../models/User.js');
const Review=require("../models/review.js");
const listing=require('../models/listing.js');

module.exports.reviewCreate=async(req,res)=>{
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
};

module.exports.reviewDelete=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};