const express=require('express');
const ejsmate=require('ejs-mate');
const path=require('path');
const app=express();
const {listingschema}=require("./schema.js");
const mongoose=require('mongoose');
const listing=require('./models/listing.js');
const methodoverride=require('method-override');
const wrapAsync=require("./utils/wrapAsync.js");
const expresserror=require("./utils/expresserror.js");
const murl="mongodb://127.0.0.1:27017/LuxeLodge";

main().then(()=>{
    console.log("Connected To MongoDB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(murl);
};

const validateListingSchema=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        throw new expresserror(400,error);
    }else{
        next();
    }
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs",ejsmate); 

app.get("/",(req,res)=>{
    res.send("Hi, I am Root");
});

//Index Route main route default 
app.get("/listings",wrapAsync(async (req,res)=>{
    const all_listing=await listing.find({});
    res.render("listings/index.ejs",{all_listing});
}));

//New Route new post mata
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//Show Route id throught jose
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.render("listings/show.ejs",{listings});
}));

//Create Route
app.post("/listings",validateListingSchema,wrapAsync(async(req,res,next)=>{
    const nlisting=new listing(req.body.listing);
    await nlisting.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.render("listings/edit.ejs",{listings});
}));

//Update Route
app.put("/listings/:id",validateListingSchema,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next(new expresserror(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("8080 is listening.....");
});