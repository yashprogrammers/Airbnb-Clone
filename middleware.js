const Listing = require("./models/listing")
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("success", "You are not Login")
        return res.redirect("/login")
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("success", "You dont have persion to edit")
        return res.redirect("/listing")
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("success", "You dont have persion to delete")
        return res.redirect("/listing")
    }
    next()
}