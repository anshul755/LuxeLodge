const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

const murl="mongodb://127.0.0.1:27017/LuxeLodge";

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(murl);
}

const initDB=async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>
        ({...obj,owner:"682f03f55ea6fc05f25139aa"})
    );
    await listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();