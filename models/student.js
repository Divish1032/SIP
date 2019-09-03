var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

/* Create Schema, then a model which gives you all the methods */
var studentSchema = new mongoose.Schema({
    name : String,
    googleid : String,
    emailid : String,
    branch : String,
    phone : String,
    profile : String,
    job_applied_company : [{
        id : String,
        answer : [{
            type: String
        }]
    }] 
});

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", studentSchema);

/* module.exports = mongoose.model("jobDetail",jobSchema); */