const express = require("express")
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js")
const wrapAsync = require("../utilits/wrapAsync.js")
const Review = require("../models/review.js")
const {reviewSchema} = require("../Schema.js")
const {isLoggedIn, isReviewAuthor} = require("../middleware.js")

const validateReview = (req, res, next) => {
  let errMsg = reviewSchema.validate(req.body);
  console.log(errMsg.error);
  if(errMsg.error) {
    throw new ExpressError(404, errMsg.error.message)
  } else {
    next();
  }
}


router.post("/",isLoggedIn,validateReview, wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review)
  newReview.author = req.user._id 
  listing.review.push(newReview)

  newReview.save();
  listing.save();
  res.redirect(`/listing/${listing._id}`)
}))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync( async (req, res) => {
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}})
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/listing/${id}`)
}))

module.exports = router