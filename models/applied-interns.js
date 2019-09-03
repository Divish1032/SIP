var mongoose = require("mongoose");

/* Create Schema, then a model which gives you all the methods */
var appliedInternSchema = new mongoose.Schema({
    company_id : String,
    company_name :String,
    company_profile : String,
    student_name : String, 
    student_email : String,
    student_phone : String,
    student_id : String,
    answer : [{
        type : String
    }]
});

var appliedIntern = mongoose.model("applications",appliedInternSchema);

module.exports = appliedIntern;

/* module.exports = mongoose.model("Campground",campgroundSchema); */