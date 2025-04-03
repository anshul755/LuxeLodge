const express=require('express');
const ejsmate=require('ejs-mate');
const path=require('path');
const app=express();
const mongoose=require('mongoose');
const methodoverride=require('method-override');
const expresserror=require("./utils/expresserror.js");
const murl="mongodb://127.0.0.1:27017/LuxeLodge";
const listsroutes=require("./routes/listing.js");
const reviewroutes=require("./routes/review.js");

main().then(()=>{
    console.log("Connected To MongoDB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(murl);
};

app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs",ejsmate); 

app.use("/listings",listsroutes);
app.use("/listings/:id/reviews",reviewroutes);

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