const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expresserror=require("../utils/expresserror.js");
const {listingschema,reviewschema}=require("../schema.js");
const {isLoggedIn}=require('../middleware.js');
const reviewController=require('../controllers/review.js');

const validateReviewSchema=(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
    if(error){
        throw new expresserror(400,error.message);
    }else{
        next();
    }
}

router.post("/",isLoggedIn,validateReviewSchema,wrapAsync(reviewController.reviewCreate));

router.delete("/:reviewId",isLoggedIn,wrapAsync(reviewController.reviewDelete));

module.exports=router;