var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

/* Create Schema, then a model which gives you all the methods */
var studentSchema = new mongoose.Schema({
    username : { 
        type :String,
        require: true,
    },
    googleid : { 
        type :String,
        require: true
    },
    email : { 
        type :String,
        require: true, 
        index:true, 
        unique:true,
        sparse:true 
    },
    password : { type : String},
    branch : { type: String },
    college : { type: String },
    city : { type: String },
    year : { type: String },
    phone : { type: String },
    profile : { type: String },
    resume_link : { type: String }
    
});

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", studentSchema);

/* module.exports = mongoose.model("jobDetail",jobSchema); */