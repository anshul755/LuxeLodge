const listing=require('../models/listing.js');
const flash=require("connect-flash");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.indexRoute = async (req, res, next) => {
  try {
    const { q } = req.query;
    let all_listing;

    if (q && q.trim().length > 0) {
      const regex = new RegExp(escapeRegex(q), 'i');
      all_listing = await listing.find({
        $or: [
          { title: regex },
          { description: regex }
        ]
      });
    } else {
      all_listing = await listing.find({});
    }

    res.render("listings/index.ejs", { all_listing, q });
  } catch (err) {
    next(err);
  }
};

module.exports.newRoute=(req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.showRoute=async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id).populate("reviews").populate("owner");
    if(!listings){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listings,res,googleMapsKey: process.env.googlemaps_api_key});
};

module.exports.createRoute=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const nlisting=new listing(req.body.listing);
    nlisting.owner=req.user._id;
    nlisting.image={url,filename};
    await nlisting.save();
    req.flash("success","New Listing Added!");
    res.redirect("/listings");
};

module.exports.editRoute=async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.render("listings/edit.ejs",{listings});
};

module.exports.updateRoute=async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listings.image={url,filename};
    }

    await listings.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute=async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

