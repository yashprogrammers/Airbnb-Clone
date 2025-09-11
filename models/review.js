const mongoose = require("mongoose");
const { type } = require("../Schema");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Review", reviewSchema);