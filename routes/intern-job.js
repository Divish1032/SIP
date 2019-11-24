var express = require("express");
var router = express.Router();
const User = require('../models/student')
var Internship = require("../models/intern-job");
var Application = require("../models/applied-interns");
// var middleware = require("../middleware/index");  // Inddex.js is the sort of default file
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


router.get("/", middleware.isLoggedIn, function(req, res){
    // console.log(req.user);  // Contains the username and id of the user as an object. Use this in the header template.
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

// New Route

router.get("/new",middleware.checkCampgroundOwnership, function(req, res) {
   res.render("internships/new", {user : req.user}) ;
});


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
   var can_apply_portal = req.body.can_appply_portal;
   var email = req.body.emailId;
   var email_app_req = req.body.email_app_req;
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
   var newInternship = { company_name : name, company_profile : profile, stipend : stipend, location : location, duration : duration, perks : perks, requirement : require, company_details : company_details, job_posted : job_posted, role : result, author : author, can_apply_portal : can_apply_portal, email : email, email_application_requirement : email_app_req};
   Internship.create(newInternship, function(err, newlyCreatedIntership){
      if(err){console.log(err);}
      else{
        req.flash("success","Successfully posted a new internship");
        res.redirect("/internships");       
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
    Internship.findById(req.params.id).exec(function(err, foundInternship){
    /* Campground.findById(req.params.id, function(err, foundCampground){ */
       if(err){ console.log(err); }
       else{
           res.render("internships/show", {internship : foundInternship, user: req.user, applied : applied, adminEmail : process.env.EMAILID_KEY || keys.admin.email});
       }
    });
});

router.get("/:id/assessment-test", middleware.isLoggedIn, function(req, res){
  
    if(req.user.phone == null){
        res.redirect("/profile");
    }
    else{
        var applied = false;
        var job_applied_answers = []
        req.user.job_applied_company.forEach(element => {
            if(element.id == req.params.id){
                applied = true;
                job_applied_answers = element.answer;
            }
        });

        Internship.findById(req.params.id, function(err, foundInternship) {
            if(err){console.log(err);}
            else{
                if(foundInternship.can_apply_portal != 'yes'){
                    if(applied == false){
                        let mailOptions = {
                            from: 'ecell@itbhu.ac.in', // sender address
                            to: req.user.emailid, // list of receivers
                            subject: 'Please Respond : Ecell IIT(BHU) Varanasi', // Subject line
                            text: 'It Worked', // plain text body
                            html: '<b>Hi ' + req.user.name +', </b> <br> <p> In order to apply for this internship ' + foundInternship.email_application_requirement + ' : '+ foundInternship.email +'</p>' // html body
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                res.send('de')
                            }
                            Internship.findById(req.params.id).then((foundJob) => {
                                Application.create({company_id : req.params.id, student_id : req.user._id, answer : [], company_name : foundJob.company_name, company_profile : foundJob.company_profile, student_name : req.user.name, student_email : req.user.emailid, student_phone : req.user.phone});
                            })

                            var f = {
                                id : req.params.id,
                                answer : []
                            }
                            var update = req.user.job_applied_company;
                            update.push(f);
                             User.findOneAndUpdate({googleid : req.user.googleid}, {job_applied_company : update} , function(err, updatedUser) {
                                if(err){
                                    res.redirect('/internships');
                                }
                                else{
                                    res.render("send-email.ejs" , { user : req.user});
                                }
                            })
                            });
                    }
                    else{
                        res.render("send-email.ejs" , { user : req.user});
                    }
                }
                else{
                    res.render("internships/assessment", {internship : foundInternship, user: req.user, applied : applied, answer : job_applied_answers});
                }
            }
        })
    }
    
})

// Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Internship.findById(req.params.id, function(err, foundInternship) {
       if(err){console.log(err);}
       else{
        res.render("internships/edit", {internship : foundInternship, user: req.user});
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
        Internship.findById(req.params.id).then((foundJob) => {
            Application.create({company_id : req.params.id, student_id : req.user._id, answer : answer, company_name : foundJob.company_name, company_profile : foundJob.company_profile, student_name : foundStudent.name, student_email : foundStudent.emailid, student_phone : foundStudent.phone});
        })
    });
    

    var update = req.user.job_applied_company;
    update.push(f);
     User.findOneAndUpdate({googleid : req.user.googleid}, {job_applied_company : update} , function(err, updatedUser) {
        if(err){
            res.redirect('/internships');
        }
        else{
            req.flash("success","Application apllied");
            res.redirect("/internships/" + req.params.id);
        }
    })
})

router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
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


// Destroy Campground Route

router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
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