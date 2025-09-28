require('dotenv').config();

const express = require("express")
const router = express.Router();
const wrapAsync = require("../utilits/wrapAsync.js")
const ExpressError = require("../utilits/ExpressError.js");
const Listing = require("../models/listing.js")
const listingSchema = require("../Schema.js")
const { isLoggedIn, isOwner } = require("../middleware.js")
const { newForm, newlistingadd, index, info, editInfo, deleteInfo, updateInfo } = require("../controllers/listing.js")
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

const validateListing = (req, res, next) => {
  let errMsg = listingSchema.validate(req.body);
  console.log(errMsg.error);
  if (errMsg.error) {
    throw new ExpressError(404, errMsg.error.message)
  } else {
    next();
  }
}


router.route("/")
  .get(wrapAsync(index))
  .post(upload.single('listing[url]'),validateListing,wrapAsync(newlistingadd))
  // .post(upload.single('listing[url]'), (req, res) => {
  //   res.send(req.file)
  // })
// router.post("/", validateListing, wrapAsync(newlistingadd))

// router.get("/", wrapAsync(index))

router.get("/new", isLoggedIn, newForm)


router.get("/:id/edit", wrapAsync(editInfo))

router.route("/:id")
  .get(wrapAsync(info))
  .patch(isLoggedIn, isOwner,upload.single('listing[url]'), validateListing, wrapAsync(updateInfo))
  .delete(wrapAsync(deleteInfo))

// router.get("/:id", wrapAsync(info))

// router.patch("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateInfo))

// router.delete("/:id", wrapAsync(deleteInfo))

module.exports = router;