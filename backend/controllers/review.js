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
    const populatedReview=await Review.findById(newReview._id);
    res.status(201).json({ message:"Review Added!", review:populatedReview });
};

module.exports.reviewDelete=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.json({ message:"Review Deleted!" });
};
