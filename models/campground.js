var mongoose = require("mongoose");

/* Create Schema, then a model which gives you all the methods */
var campgroundSchema = new mongoose.Schema({
    company_name : String,
    company_profile : String,
    stipend : String,
    location : String,
    duration : String,
    perks : String,
    requirement : String,
    company_details : String,
    job_posted : String,
    role : [{
        type: String
    }],
    
});

var Campground = mongoose.model("Campground",campgroundSchema);

module.exports = Campground;

/* module.exports = mongoose.model("Campground",campgroundSchema); */