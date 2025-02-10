const express=require('express');
const path=require("path");

const app=express();

const mongoose=require('mongoose');
const listing=require("./models/listing.js");

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

app.get("/",(req,res)=>{
    res.send("Hi, I am Root");
});

app.get("/listing", async (req,res)=>{
    const all_listing=await listing.find({});
    res.render("listings/index.ejs",{all_listing});
});

app.listen(8080,()=>{
    console.log("8080 is listening.....");
});

