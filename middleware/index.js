// All the middleware
var Internship = require("../models/intern-job");
var flash = require("connect-flash");
var middlewareObj = {};
var key = require('../models/keys')


middlewareObj.checkCampgroundOwnership = function(req, res, next){
     // Is user Logged in
    if(req.user.emailid == key.admin.email){
        next();
        
    }else{
        res.redirect("back");  // Redirect to the previous page
        //res.send("You need to be logged in to edit the campground");
    }
}



middlewareObj.isLoggedIn = function (req, res, next){
    if(req.user){
        return next();
    }
    req.flash("error", "Please Login First!");  //  This should be present before the redirection. Else won't work
    // Pass this object { message : req.flash("success") } to res redirect.        
    // This would be displayed in the next page 
    res.redirect("/login");
}


module.exports = middlewareObj;