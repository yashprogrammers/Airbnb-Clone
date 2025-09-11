const express = require("express")
const router = express.Router();
const wrapAsync = require("../utilits/wrapAsync.js")
const ExpressError = require("../utilits/ExpressError.js");
const Listing = require("../models/listing.js")
const listingSchema = require("../Schema.js")
const {isLoggedIn} = require("../middleware.js")

const validateListing = (req, res, next) => {
  let errMsg = listingSchema.validate(req.body);
  console.log(errMsg.error);
  if(errMsg.error) {
    throw new ExpressError(404, errMsg.error.message)
  } else {
    next();
  }
}



router.get("/new",isLoggedIn,(req, res) => {
  res.render("listing/new.ejs")
})

router.post("/", validateListing, wrapAsync(async (req, res) => {
  // if(!req.body.listing) {throw new ExpressError(400, "send valid data")}
  // let result = listingSchema.validate(req.body);
  // if(result.error) {
  //   throw new ExpressError(404, result.error)
  // }
  // console.log(result);
  const newListing = new Listing(req.body.listing);
  console.log(newListing);
  await newListing.save();
  req.flash("success", "Listing created successfully")
  res.redirect("/listing")
}))

router.get("/", wrapAsync( async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listing/index.ejs", {allListing})
}))

router.get("/:id", wrapAsync( async (req, res)=> {
  let {id} = req.params;
  let info = await Listing.findById(id).populate('review');
  res.render("listing/info.ejs", {info})
}))

router.get("/:id/edit", wrapAsync(async (req, res) => {
  let {id} = req.params;
  let info = await Listing.findById(id);
  res.render("listing/edit.ejs", {info});
}))

router.patch("/:id", wrapAsync( async (req, res) => {
  let {id} = req.params;
  let update = await Listing.findByIdAndUpdate(id, {...req.body.listing})
  console.log(update);
  res.redirect("/listing")
}))


router.delete("/:id",wrapAsync( async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success","listing deleted successfully")
  res.redirect("/listing")
}))

module.exports = router;