const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const expresserror=require("../utils/expresserror.js");
const {listingschema}=require("../schema.js");
const {isLoggedIn}=require('../middleware.js');
const listingController=require('../controllers/listing.js');
const {storage}=require('../cloudConfig.js');
const multer=require('multer');
const upload=multer({storage});

const normalizeListingBody=(req,res,next)=>{
    req.body.listing = req.body.listing || {
        title:req.body.title || req.body["listing[title]"],
        description:req.body.description || req.body["listing[description]"],
        price:req.body.price || req.body["listing[price]"],
        location:req.body.location || req.body["listing[location]"],
        country:req.body.country || req.body["listing[country]"],
    };
    next();
}

const validateListingSchema=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let ermessage=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,ermessage);
    }else{
        next();
    }
}

router.get("/",wrapAsync(listingController.indexRoute));

router.get("/:id", wrapAsync(listingController.showRoute));

router.post("/",isLoggedIn,upload.single("image"),normalizeListingBody,validateListingSchema,wrapAsync(listingController.createRoute));

router.put("/:id",isLoggedIn,upload.single("image"),normalizeListingBody,validateListingSchema,wrapAsync(listingController.updateRoute));

router.delete("/:id",isLoggedIn,wrapAsync(listingController.deleteRoute));

module.exports = router;
