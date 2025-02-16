const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const listSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename:{type:String},
        url:{
          type:String,
          default:"https://images.unsplash.com/photo-1738924349706-14d70715e236?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"
        },
    },
    price:{
        type:Number,
        requried:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:String,
});

const listing=mongoose.model("listing",listSchema);

module.exports=listing;