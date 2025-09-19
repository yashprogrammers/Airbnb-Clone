const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

const MONGO_URL = 'mongodb://127.0.0.1:27017/Airbnb';

main().then(()=>{console.log("connected mongoose");}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async (req, res) => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68c3168ce424a17dae719862"
  }))
  await Listing.insertMany(initData.data);
  console.log("data is initialized");
}

initDB();