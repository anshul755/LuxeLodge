const express=require('express');

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

app.get("/",(req,res)=>{
    res.send("Hi, I am Root");
});

app.get("/testlisting", async (req,res)=>{
    let samplelisting=new listing({
        title:"My New Villa",
        description:"By The Beach",
        price:1200,
        location:"Calangute, Goa",
        country:"India",
    });

    await samplelisting.save();
    console.log("sample was saved");
    res.send("successful testing");
});

app.listen(8080,()=>{
    console.log("8080 is listening.....");
});

