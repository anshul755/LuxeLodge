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
          type:String,
          default:"https://images.unsplash.com/photo-1738924349706-14d70715e236?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
          set: (v) =>
            v === "" ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60": v,
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