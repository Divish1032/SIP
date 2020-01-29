var express = require("express");
var router = express.Router();
var passport = require("passport");
var flash = require("connect-flash");
var middleware = require("../middleware");
const User = require('../models/student');
var Internship = require("../models/intern-job");
var Application = require("../models/applied-interns");
var keys = require('../models/keys');

// Landing Page
router.get('/', (req, res) => {
        res.render("landing", {user : req.user}); 
});

// Google auth
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Abous Us page
router.get('/about-us', (req, res) => {
   res.render("know-more", {user : req.user});
});

// Get profile page
router.get('/profile', middleware.isLoggedIn, (req,res) => {
    Application.find({student_email : req.user.email}, function(err, appliedIntern) {
        if(err){res.send(err);}
        else{
            res.render("profile", {user : req.user, job_selected : appliedIntern});
        }  
    });
});

// Google Call back
router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureFlash: 'User has not yet registered on E-Summit 20 IIT BHU.',
        failureRedirect: '/'
    }),
    (req, res) => {
        req.flash("success","Successfully logged you in");
        res.redirect('/internships');
        delete req.session.returnTo;
        
    }
);

// Edit Profile
router.put("/profile/:id", middleware.isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedCampground){
         if(err){ 
             res.redirect('/');
         }
         else{
            req.flash("success","Successfully updated your profile");
             res.redirect("/profile");
         }
    }); 
 });

// Login Routes
router.get("/login", function(req, res) {
    res.render("login", {user : req.user});
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/");
});




module.exports = router;