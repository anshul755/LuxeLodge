const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport=require('passport');

const { saverurl } = require('../middleware.js');
const authController=require('../controllers/User.js');

router.route("/signup")
.get(authController.getsignUp)
.post(wrapAsync(authController.createAccount));

router.route("/login")
.get(authController.getLogin)
.post(saverurl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),authController.Login);

router.get("/logout",authController.Logout)

module.exports = router;