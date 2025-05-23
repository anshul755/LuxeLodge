const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const expresserror=require("../utils/expresserror.js");
const {listingschema,reviewschema}=require("../schema.js");
const {isLoggedIn}=require('../middleware.js');
const listingController=require('../controllers/listing.js');
const {storage}=require('../cloudConfig.js');
const multer=require('multer');
const upload=multer({storage});

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

router.get("/new",isLoggedIn,listingController.newRoute);

router.get("/:id", wrapAsync(listingController.showRoute));

router.post("/",upload.single("listing[image]"),validateListingSchema,wrapAsync(listingController.createRoute));

router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editRoute));

router.put("/:id",upload.single("listing[image]"),isLoggedIn,validateListingSchema,wrapAsync(listingController.updateRoute));

router.delete("/:id",isLoggedIn,wrapAsync(listingController.deleteRoute));

module.exports = router;