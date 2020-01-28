var express = require("express");
var router = express.Router();
const User = require('../models/student')
var Internship = require("../models/intern-job");
var Application = require("../models/applied-interns");
var middleware = require("../middleware"),
    nodeMailer = require('nodemailer')
var keys = require('../models/keys')

let transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
            user: process.env.EMAILID_KEY || keys.admin.email,
            pass: process.env.EMAILID_PASS || keys.admin.password
        }
});


// All Intern Page 
router.get("/", function(req, res){
    Internship.find({},function(err, Internships){
       if(err){console.log(err);}
       else{

           function compare( a, b ) {
            if ( a.job_posted < b.job_posted ){
              return 1;
            }
            if ( a.job_posted > b.job_posted ){
              return -1;
            }
            return 0;
          }

          Internships = Internships.sort( compare );

           // res.render("campgrounds/index", {campgrounds : campgrounds, currentUser : req.user});
           res.render("internships/index", {internships : Internships, user : req.user, adminEmail : process.env.EMAILID_KEY ||  keys.admin.email});
       }
    });
}); 

// New Internship Form
router.get("/new",middleware.checkInternshipOwnership, function(req, res) {
   res.render("internships/new", {user : req.user}) ;
});


// Post Internship
router.post("/",middleware.checkInternshipOwnership, function(req, res) {
   var name = req.body.company_name;
   var logo_url = req.body.logo_url;
   var profile = req.body.intern_profile;
   var stipend = req.body.stipend;
   var location = req.body.location;
   var duration  = req.body.duration;
   var perks = req.body.perks;
   var require = req.body.role_requirement;
   var company_details = req.body.company_detail;
   var job_posted = req.body.job_posted;
   var role = req.body.role_responsibility;
   var email = req.body.email || null;
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
   var newInternship = { company_name : name, logo_url : logo_url, company_profile : profile, stipend : stipend, location : location, duration : duration, perks : perks, requirement : require, company_details : company_details, job_posted : job_posted, role : result, email : email};
   Internship.create(newInternship, function(err, newlyCreatedIntership){
      if(err){console.log(err);}
      else{
        req.flash("success","Successfully posted a new internship");
        res.redirect("/internships");       
      }
   });
});

// Get a particular internship
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    var applied = false;
    Application.find({ company_id : req.params.id, student_email : req.user.email}, (error, appliedIntern) => {
        if(error)res.send(error);
        else{
            if(appliedIntern.length != 0){
                applied = true;
            }
            Internship.findById(req.params.id).exec(function(err, foundInternship){
                if(err){ console.log(err); }
                else{
                    
                    res.render("internships/show", {internship : foundInternship, user: req.user, applied : applied, adminEmail : process.env.EMAILID_KEY || keys.admin.email});
                }
             });
        }
    })
});

// Get assessment test of an internship
router.get("/:id/assessment-test", middleware.isLoggedIn, function(req, res){
    if(req.user.phone == null || req.user.branch == null || req.user.college == null || req.user.city == null || req.user.resume_link == null || req.user.phone == "" || req.user.branch == "" || req.user.college == "" || req.user.city == "" || req.user.resume_link == ""){
        req.flash("error","Fill your profile details before applying.");
        res.redirect("/profile");
    }
    else{
        var applied = false;
        var job_applied_answers = []
        Application.find({ company_id : req.params.id, student_email : req.user.email}, (error, appliedIntern) => {
            if(error)res.send(error);
            else{
                
                if(appliedIntern.length != 0){
                    applied = true;
                    job_applied_answers = appliedIntern[0].answer;
                }
                Internship.findById(req.params.id, (err, foundInternship) => {
                    if(err){console.log(err);}
                    else{
                        res.render("internships/assessment", {internship : foundInternship, user: req.user, applied : applied, answer : job_applied_answers});
                    }
                })
            }
        });
    }
    
})

// Edit form of a internship
router.get("/:id/edit", middleware.checkInternshipOwnership, function(req, res) {
    Internship.findById(req.params.id, function(err, foundInternship) {
       if(err){console.log(err);}
       else{
        res.render("internships/edit", {internship : foundInternship, user: req.user});
       }
   })
    
});

// Put job application insert
router.put("/:id/job-apllication", middleware.isLoggedIn, function(req, res) {
    var id= req.params.id;
    var answer = [req.body.ans1, req.body.ans2];
    Internship.findById(id).then((foundJob) => {
        Application.create({company_id : id, answer : answer, company_name : foundJob.company_name, company_profile : foundJob.company_profile, student_name : req.user.name, student_email : req.user.email, student_phone : req.user.phone, student_college: req.user.college, student_branch : req.user.branch, resume : req.user.resume_link}, (err, result) => {
            if(err)res.send(err);
            else{
                req.flash("success","Application apllied");
                res.redirect("/internships/" + req.params.id);
            }
        });
    });
});

// Update internship
router.put("/:id",middleware.checkInternshipOwnership, function(req, res){
    Internship.findByIdAndUpdate(req.params.id, req.body.internship, function(err, updatedInternship){
        if(err){ 
            res.redirect('/internships');
        }
        else{
            req.flash("success","Successfully updated the internship");
            res.redirect("/internships/" + req.params.id);
        }
   }); 
});

// Delete Internship
router.delete("/:id", middleware.checkInternshipOwnership,function(req, res){
    Internship.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/internships");
        } else{
            req.flash("success","Successfully deleted an internship");
            res.redirect("/internships");
        }
    })
});




 

module.exports = router; 