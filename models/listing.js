const mongoose=require('mongoose');
const { type } = require('os');
const { listingschema } = require('../schema');
const Schema=mongoose.Schema;
const review=require("./review.js");
const User=require("./User.js");

const listSchema=new Schema({
    title:{
        type:String,
    },
    description:String,
    image:{
        url:String,
        filename:String,      
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id: {$in:listing.reviews}});
    }
});

const listing=mongoose.model("listing",listSchema);

module.exports=listing;