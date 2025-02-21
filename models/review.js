const mongoose=require('mongoose');
const { type } = require('os');
const Schema=mongoose.Schema;

const review=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:date,
        default:Date.now(),
    },
});

const reviewSchema=mongoose.model("Review",review);

module.exports=reviewSchema;