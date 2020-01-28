var mongoose = require("mongoose");

/* Create Schema, then a model which gives you all the methods */
var internshipSchema = new mongoose.Schema({
    company_name : String,
    logo_url : String,
    company_profile : String,
    stipend : String,
    location : String,
    duration : String,
    perks : String,
    requirement : String,
    company_details : String,
    job_posted : {
        type: Date,
        default: Date.now
    },
    role : [{
        type: String
    }],
    email : String
    
});

var Internship = mongoose.model("Internship",internshipSchema);

module.exports = Internship;

/* module.exports = mongoose.model("Campground",campgroundSchema); */