var express = require("express");
var router = express.Router();

var Campground = require("../models/job-details");

/* Campgrounds Route */
// Show All Campgrounds Route   -- Index
router.get("/",function(req, res){
    res.render("campgrounds/index2"); 
}); 

router.get("/gggg",function(req, res) {
    res.render("campgrounds/show2")
});

router.get("/job/assessment-test",function(req, res) {
    res.render("campgrounds/assessment")
});

module.exports = router;