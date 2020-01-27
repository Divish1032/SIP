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
const keys = require('./models/keys');


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


app.use(bodyParser.urlencoded({ extended: true }));

/*View Engine*/
app.set("view engine","ejs");

app.use(function(req, res , next){
    res.locals.currentUser = req.user;   
    res.locals.error = req.flash("error");  
    res.locals.success = req.flash("success"); 
    next();
 });


/*Database Connections*/
mongoose.connect(process.env.DATABASE_URL || keys.admin.mongoDB);
// 'mongodb://ecell:ecell007@ds215988.mlab.com:15988/student_internship_portal'


/* Routes */
app.use("/",indexRoutes);
app.use("/internships",internshipRoutes);      

const PORT = process.env.PORT || 8000;

app.listen(PORT, function(){
    console.log("Server started");
}); 
