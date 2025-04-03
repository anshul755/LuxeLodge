const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing=require('../models/listing.js');
const expresserror=require("../utils/expresserror.js");
const {listingschema,reviewschema}=require("../schema.js");

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
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//Show Route id throught jose
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listings});
}));

//Create Route
router.post("/",validateListingSchema,wrapAsync(async(req,res,next)=>{
    const nlisting=new listing(req.body.listing);
    await nlisting.save();
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.render("listings/edit.ejs",{listings});
}));

//Update Route
router.put("/:id",validateListingSchema,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    res.redirect("/listings");
}));

module.exports = router;