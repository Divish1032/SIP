var express = require("express");
var router = express.Router();
var passport = require("passport");
var flash = require("connect-flash");
var middleware = require("../middleware");
const User = require('../models/student');
var Internship = require("../models/intern-job");
var Application = require("../models/applied-interns");

router.get('/', (req, res) => {
        res.render("landing", {user : req.user}); 
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/");
});

router.get('/about-us', (req, res) => {
   res.render("know-more", {user : req.user});
});

router.get('/profile', middleware.isLoggedIn, (req,res) => {
    var job_selected = [];
    
    Internship.find({}, function(err, alljobs) {
            if(err){console.log(err);}
            else{
                alljobs.forEach(job => {
                    req.user.job_applied_company.forEach(elem => {
                        if(job._id == elem.id){
                            job_selected.push(job);
                            console.log(job)
                        }
                    })
                })
            }
            job_selected.forEach(elem => {
                console.log("++" + elem);
            })
            
            res.render("profile", {user : req.user, job_selected : job_selected});  
            if(req.user.phone == null){
                console.log("==================")
                req.flash("error","Please enter your phone number");
            }
        });
} )

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        req.flash("success","Successfully logged you in");
        res.redirect('/internships');
    }
);

router.put("/profile/:id", middleware.isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedCampground){
         if(err){ 
             res.redirect('/');
         }
         else{
            req.flash("success","Successfully updated your number");
             res.redirect("/profile");
         }
    }); 
 });


router.get("/list-jobs", middleware.checkCampgroundOwnership, function(req, res){
    Application.find({}, function(err, jobs){
        if(err){
            console.log(err);
            res.redirect('/profile');
        }
        else{
            var temp = groupBy1("company_id", jobs);
            console.log(temp);
            res.render("all-jobs", {user : req.user, jobs : temp});
        }
    })
})




// Show register routes  (Or the SignUp routes)

function groupBy1(key, array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
      var added = false;
      for (var j = 0; j < result.length; j++) {
        if (result[j][key] == array[i][key]) {
          result[j].items.push(array[i]);
          added = true;
          break;
        }
      }
      if (!added) {
        var entry = {items: []};
        entry[key] = array[i][key];
        entry.items.push(array[i]);
        result.push(entry);
      }
    }
    return result;
  }


// Login Routes
router.get("/login", function(req, res) {
    res.render("login", {user : req.user});
});





module.exports = router;