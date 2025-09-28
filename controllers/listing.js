const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  // console.log(allListing[0].url.link);
  
  res.render("listing/index.ejs", { allListing })
}

module.exports.newForm = (req, res) => {
  res.render("listing/new.ejs")
}

module.exports.newlistingadd = async (req, res) => {
  // if(!req.body.listing) {throw new ExpressError(400, "send valid data")}
  // let result = listingSchema.validate(req.body);
  // if(result.error) {
  //   throw new ExpressError(404, result.error)
  // }
  // console.log(result);
  let link = req.file.path
  let filename = req.file.filename

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.url = {link, filename}
  console.log(newListing);
  await newListing.save();
  req.flash("success", "Listing created successfully")
  res.redirect("/listing")
}

module.exports.info = async (req, res) => {
  let { id } = req.params;
  let info = await Listing.findById(id)
    .populate({
      path: 'review',
      populate: { path: 'author', model: 'User' }
    })
    .populate('owner');
  console.log(info)
  res.render("listing/info.ejs", { info })
}

module.exports.editInfo = async (req, res) => {
  let { id } = req.params;
  let info = await Listing.findById(id);
  let orginalImg = info.url.link
  orginalImg = orginalImg.replace("/upload","/upload/w_600/q_10")
  res.render("listing/edit.ejs", { info, orginalImg});
}

module.exports.updateInfo = async (req, res) => {
  let { id } = req.params;
  let editlisting = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  let link = req.file.path
  let filename = req.file.filename
  editlisting.url = {link,filename}
  editlisting.save()
  req.flash("success", "You have persion to edit")
  res.redirect("/listing")
}

module.exports.deleteInfo = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success", "listing deleted successfully")
  res.redirect("/listing")
}