const listing=require('../models/listing.js');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function distanceInKm(fromLat, fromLng, toLat, toLng) {
  const earthRadiusKm = 6371;
  const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
  const latDiff = degreesToRadians(toLat - fromLat);
  const lngDiff = degreesToRadians(toLng - fromLng);
  const startLat = degreesToRadians(fromLat);
  const endLat = degreesToRadians(toLat);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports.indexRoute = async (req, res, next) => {
  try {
    const { q, lat, lng } = req.query;
    const page = toPositiveNumber(req.query.page, 1);
    const limit = Math.min(toPositiveNumber(req.query.limit, 12), 48);
    const skip = (page - 1) * limit;
    let filter = {};

    if (q && q.trim().length > 0) {
      const regex = new RegExp(escapeRegex(q), 'i');
      filter = {
        $or: [
          { title: regex },
          { description: regex },
          { location: regex },
          { country: regex },
        ]
      };
    }

    const userLat = Number(lat);
    const userLng = Number(lng);
    const shouldSortByDistance = Number.isFinite(userLat) && Number.isFinite(userLng);
    const total = await listing.countDocuments(filter);
    let all_listing;

    if (shouldSortByDistance) {
      const listingsWithCoordinates = await listing.find({
        ...filter,
        "coordinates.lat": { $type: "number" },
        "coordinates.lng": { $type: "number" },
      });
      all_listing = listingsWithCoordinates
        .map((item) => ({
          listing: item,
          distanceKm: distanceInKm(userLat, userLng, item.coordinates.lat, item.coordinates.lng),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(skip, skip + limit)
        .map(({ listing: item, distanceKm }) => ({
          ...item.toObject(),
          distanceKm: Number(distanceKm.toFixed(1)),
        }));
    } else {
      all_listing = await listing.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit);
    }

    res.json({
      listings: all_listing,
      q,
      pagination: {
        page,
        limit,
        total: shouldSortByDistance ? all_listing.length + skip : total,
        totalPages: shouldSortByDistance ? Math.max(1, Math.ceil(total / limit)) : Math.max(1, Math.ceil(total / limit)),
        hasPrevPage: page > 1,
        hasNextPage: page * limit < total,
      },
      sortedByLocation: shouldSortByDistance,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.newRoute=(req,res)=>{
    res.status(410).json({ error: "This page now lives in the React frontend." });
};

module.exports.showRoute=async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id).populate("reviews").populate("owner");
    if(!listings){
        return res.status(404).json({ error: "Listing you requested for does not exist!" });
    }
    res.json({ listing: listings, googleMapsKey: process.env.googlemaps_api_key || "" });
};

module.exports.createRoute=async(req,res,next)=>{
    if(!req.file){
        return res.status(400).json({ error: "Listing image is required." });
    }
    let url=req.file.path;
    let filename=req.file.filename;
    const nlisting=new listing(req.body.listing);
    nlisting.owner=req.user._id;
    nlisting.image={url,filename};
    await nlisting.save();
    const createdListing=await listing.findById(nlisting._id).populate("owner");
    res.status(201).json({ message: "New Listing Added!", listing: createdListing });
};

module.exports.editRoute=async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.json({ listing: listings });
};

module.exports.updateRoute=async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listings.image={url,filename};
    }

    await listings.save();
    const updatedListing=await listing.findById(id).populate("owner").populate("reviews");
    res.json({ message: "Listing Updated!", listing: updatedListing });
};

module.exports.deleteRoute=async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id);
    res.json({ message: "Listing Deleted!", listing: deletelisting });
};

