const mongoose=require('mongoose');
const { ref } = require('process');

const Schema=mongoose.Schema;

const review=new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    comment:String,
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    username:{
        type:String,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports=mongoose.model("Review",review);