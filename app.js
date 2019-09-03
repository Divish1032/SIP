var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
var flash = require("connect-flash");
var methodOverride = require("method-override");
var cookieParser = require('cookie-parser'),
    passport = require('passport'),
    cookieSession = require('cookie-session');
const  auth = require('./auth');


auth(passport);
app.use(passport.initialize());


app.use(cookieSession({
    name: 'session',
    keys: ['SECRECT KEY'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());



/* Requiring Routes*/  
  var  internshipRoutes = require("./routes/intern-job"),
        indexRoutes = require("./routes/index");



/* Set the Public folder to server*/
app.use(express.static(__dirname + "/public"));

/* Set method override*/
app.use(methodOverride("_method"));
/* Set Flash */
app.use(flash());

/*Models*/
var Campground = require("./models/intern-job");


app.use(bodyParser.urlencoded({ extended: true }));

/*View Engine*/
app.set("view engine","ejs");

app.use(function(req, res , next){
    res.locals.currentUser = req.user;   // user = {username : xxxx,  _id : xxxx} // User would be available for all routes
    res.locals.error = req.flash("error");  
    res.locals.success = req.flash("success");  // Both of these variables would be empty most of the times
    next();
 });


/*Database Connections*/
mongoose.connect('mongodb://ecell:ecell007@ds215988.mlab.com:15988/student_internship_portal');


/*Seeding the DB file*/
//var SeedDb = require("./seeds");
//SeedDb();









/* Tell express to use this routes*/

/* This would work without any params merge issues =>  where the routes use req.params.id */

// app.use(indexRoutes);
// app.use(campgroundRoutes);      //  router.get("/campgrounds",....
// app.use(commentRoutes);

/* Routes */
app.use("/",indexRoutes);
app.use("/campgrounds",internshipRoutes);       // router.get("/"......

const PORT = process.env.PORT || 8000;

app.listen(PORT, function(){
    console.log("Server started");
}); 
