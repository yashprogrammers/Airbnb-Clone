module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("success", "You are not Login")
        return res.redirect("/login")
    }
    next()
}