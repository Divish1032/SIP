// All the middleware
var Campground = require("../models/campground");
var flash = require("connect-flash");
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
     // Is user Logged in
    if(req.user.emailid == 'divyansh.kumar.min16@itbhu.ac.in'){
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