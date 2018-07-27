var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');
var check = require('../middleware/isLoggedIn');

//INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    })
});

//NEW (FORM)
router.get("/new", check, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE (POST)
router.post("/", check, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    author = {id: req.user.id, username: req.user.username};
    var newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, campground) {
        if(err) {
            console.log(err);
        }
        else {
            campground.author.id = req.user.id;
            campground.author.username = req.user.username;
            campground.save();
            res.redirect("/campgrounds");
        }
    });    
});

//SHOW (MUST BE AT END TO PREVENT INTERPRETATION OF OTHER ROUTES AS ID)
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    });
});

module.exports = router;