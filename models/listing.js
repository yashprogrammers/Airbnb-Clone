const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

listingSchema.post("/findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.review}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;