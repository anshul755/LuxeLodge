const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.Cloud_name,
    api_key:process.env.Cloud_api_key,
    api_secret:process.env.Cloud_api_secret
});

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'LuxeLodge',
        allowedformat:["png","jpeg","jpg"],
    },
});

module.exports={
    cloudinary,
    storage,
};