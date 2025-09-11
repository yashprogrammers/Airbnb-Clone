const express = require("express")
// var cookieParser = require('cookie-parser')
const app = express();
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({secret: "mysecretstring", resave: false, saveUninitialized: true}))
// app.use(cookieParser("secretcode"))
app.use(flash())

app.get("/test",(req, res) => {
    res.send("test successful")
})

app.get("/register",(req, res) => {
    let {name = "user"} = req.query;
    req.session.name = name;
    req.flash("success", "user register successfully")
    res.redirect("/hello") 
})

app.get("/hello", (req, res) => {
    res.locals.msg = req.flash("success")
    res.render("hello.ejs", {name: req.session.name})
})

// app.get("/setCookie", (req, res) => {
//     res.cookie("name","Yash")
//     res.cookie("email","yashkale@gmail.com")
//     res.cookie("password", "harsh123", {signed: true})
//     res.send("Set Cookies here..")
// })

// app.get("/verify", (req, res) => {
//     res.send(req.signedCookies)
// })

// app.get("/getCookie", (req, res) => {
//     let {name = "Harsh", email} = req.cookies;
//     console.log(email);
//     res.send(`Your name is ${name}`)
// })

app.listen(8080, ()=> {
    console.log("App listing 3000 port")
})