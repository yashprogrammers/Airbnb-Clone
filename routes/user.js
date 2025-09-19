const express = require("express")
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs")
})

router.post("/signup", async (req, res) => {
    let {username, email, password} = req.body;
    const signupInfo = new User({username, email})
    let user = await User.register(signupInfo, password)
    console.log(user);
    req.login(user, (err) => {
        if(err) {
            return next(err)
        }
        req.flash("success", "sighup Successfully!")
        res.redirect("/listing")
    })
})

router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) , async(req, res) => {
    req.flash("success", "Login Successfully")
    res.redirect("/listing")
})

router.get("/logout",(req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listing")
    })
})
module.exports = router