const express=require('express');
const ejsmate=require('ejs-mate');
const path=require('path');

const app=express();

const mongoose=require('mongoose');
const listing=require('./models/listing.js');
const methodoverride=require('method-override');

const murl="mongodb://127.0.0.1:27017/LuxeLodge";

main().then(()=>{
    console.log("Connected To MongoDB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(murl);
};

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
app.get("/listings", async (req,res)=>{
    const all_listing=await listing.find({});
    res.render("listings/index.ejs",{all_listing});
});

//New Route new post mata
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

//Show Route id throught jose
app.get("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.render("listings/show.ejs",{listings});
});

//Create Route
app.post("/listings",async (req,res)=>{
    const nlisting=new listing(req.body.listing);
    await nlisting.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listings=await listing.findById(id);
    res.render("listings/edit.ejs",{listings});
});

//Update Route
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    res.redirect("/listings");
});

app.listen(8080,()=>{
    console.log("8080 is listening.....");
});

