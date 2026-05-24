const User=require('../models/User.js');

module.exports.getsignUp=(req, res) => {
    res.status(410).json({ error: "This page now lives in the React frontend." });
};

module.exports.createAccount=async (req, res, next) => {
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        let ru=await User.register(newUser,password);
        req.login(ru,(err)=>{
            if(err){
                return next(err);
            }
            res.status(201).json({
                message:"Welcome to LuxeLodge!",
                user:{ id:ru._id, username:ru.username, email:ru.email }
            });
        })
    }
    catch(e){
        res.status(400).json({ error:e.message });
    }
};

module.exports.getLogin=(req, res) => {
    res.status(410).json({ error: "This page now lives in the React frontend." });
};

module.exports.Login=async (req, res) => {
    res.json({
        message:"Welcome to LuxeLodge! You Logged in!",
        user:{ id:req.user._id, username:req.user.username, email:req.user.email }
    });
};

module.exports.Logout=(req,res,next)=>{
    if(req.isAuthenticated()){
        req.logOut((err)=>{
            if(err){
                return next(err);
            }
            res.json({ message:"You Logged Out Succesfully!" });
        })
    }else{
        res.json({ message:"You are Already Logged Out!" });
    }
};
