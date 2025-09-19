const express = require('express');
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const Listing = require("./models/listing.js")
const PORT = 3000;
const listingRoute = require("./routes/listings.js")
const reviewRoute = require("./routes/routes.js")
const userRoute = require("./routes/user.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")
const User = require("./models/user.js")
const LocalStratergy = require("passport-local")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))


const sessionOptions = {
  secret: "mynewsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}


const MONGO_URL = 'mongodb://127.0.0.1:27017/Airbnb';

main().then(() => { console.log("connected mongoose"); }).catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}


app.get('/', (req, res) => {
  res.send('Hello from Airbnb Express server!');
});

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate())) 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.currUser = req.user;
  next()
})

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "yash@gmail.com",
//     username: "yash"
//   })

//   let newUser = await User.register(fakeUser, "harshkale");
//   res.send(newUser)
// })

app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute)
app.use("/", userRoute);


// app.get("/api/listing", async (req, res) => {
//   let data = await Listing.find({})
//   res.send(data)
// })

// app.get("/testListing",async (req, res)=> {
//   let listex = new Listing({
//     title: "Gautala Forest",
//     description: "this forest in very green and clean, multidiversity happening...",
//     price: 2300,
//     location: "Maharastra, Aurangabad",
//     country: "India"
//   })
//   await listex.save();
//   console.log("saved sample");
//   res.send("Succefully tested")
// })

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });


app.use((err, req, res, next) => {
  let { status = 404, message } = err;
  console.log(err);
  
  res.status(status).render("error.ejs", { message })
  // next(new ExpressError(404, "Page Not Found"));
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});