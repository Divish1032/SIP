var express = require("express");
var router = express.Router();
const User = require('../models/student')
var Campground = require("../models/campground");
var Application = require("../models/applied-interns");
// var middleware = require("../middleware/index");  // Inddex.js is the sort of default file
var middleware = require("../middleware");


/* Campgrounds Route */
// Show All Campgrounds Route   -- Index
router.get("/", middleware.isLoggedIn, function(req, res){
    // console.log(req.user);  // Contains the username and id of the user as an object. Use this in the header template.
    Campground.find({},function(err,campgrounds){
       if(err){console.log(err);}
       else{
           // res.render("campgrounds/index", {campgrounds : campgrounds, currentUser : req.user});
           res.render("campgrounds/index", {campgrounds : campgrounds, user : req.user});
       }
    });
}); 

// New Route

router.get("/new",middleware.checkCampgroundOwnership, function(req, res) {
   res.render("campgrounds/new", {user : req.user}) ;
});

// Create Route


router.post("/",middleware.checkCampgroundOwnership, function(req, res) {
   var name = req.body.company_name;
   var profile = req.body.intern_profile;
   var stipend = req.body.stipend;
   var location = req.body.location;
   var duration  = req.body.duration;
   var perks = req.body.perks;
   
   var require = req.body.role_requirement;
   var company_details = req.body.company_detail;
   var job_posted = req.body.job_posted;
   var role = req.body.role_responsibility;
   var author = {
    id : req.user._id
    }
   var temp = role.toString();
   var str = "";
   var result = [];
   var j=0;
   for(var i =0;i<temp.length;i++){
       if(temp.charAt(i) != ';'){
           str= str+temp.charAt(i);
       }
       else{
           result[j++] = str;
           str = "";
       }
   }
   result[j] = str;
   var newCampground = { company_name : name, company_profile : profile, stipend : stipend, location : location, duration : duration, perks : perks, requirement : require, company_details : company_details, job_posted : job_posted, role : result, author : author};
   Campground.create(newCampground,function(err, newlyCreatedCampground){
      if(err){console.log(err);}
      else{
        res.redirect("/campgrounds");       
      }
   });
    /*campgrounds.push(newCampground); */   
});


// Show a Sigle Campgroound Route    --Show Route

router.get("/:id", middleware.isLoggedIn, function(req, res) {
    /* Populate the Comments for this Campground */
    var applied = false;
    var job_applied_answers = []
    req.user.job_applied_company.forEach(element => {
        if(element.id == req.params.id){
            applied = true;
            job_applied_answers = element.answer;
        }
    });
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    /* Campground.findById(req.params.id, function(err, foundCampground){ */
       if(err){ console.log(err); }
       else{
           res.render("campgrounds/show", {campground : foundCampground, user: req.user, applied : applied});
       }
    });
});

router.get("/:id/assessment-test", middleware.isLoggedIn, function(req, res){
    var applied = false;
    var job_applied_answers = []
    req.user.job_applied_company.forEach(element => {
        if(element.id == req.params.id){
            applied = true;
            job_applied_answers = element.answer;
        }
    });

    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err){console.log(err);}
        else{
         res.render("campgrounds/assessment", {campground : foundCampground, user: req.user, applied : applied, answer : job_applied_answers});
        }
    })
})

// Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
       if(err){console.log(err);}
       else{
        res.render("campgrounds/edit", {campground : foundCampground, user: req.user});
       }
   })
    
});

// Update Route

router.put("/:id/job-apllication", middleware.isLoggedIn, function(req, res) {
    var idt= req.params.id;
    var answer = [req.body.ans1, req.body.ans2];
    var f = {
        id : idt,
        answer : answer
    }

    User.findById(req.user._id).then((foundStudent) => {
        Campground.findById(req.params.id).then((foundJob) => {
            Application.create({company_id : req.params.id, student_id : req.user._id, answer : answer, company_name : foundJob.company_name, company_profile : foundJob.company_profile, student_name : foundStudent.name, student_email : foundStudent.emailid, student_phone : foundStudent.phone});
        })
    });
    

    var update = req.user.job_applied_company;
    update.push(f);
     User.findOneAndUpdate({googleid : req.user.googleid}, {job_applied_company : update} , function(err, updatedUser) {
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){ 
            res.redirect('/campgrounds');
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
   }); 
});


// Destroy Campground Route

router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
});


 

module.exports = router; 