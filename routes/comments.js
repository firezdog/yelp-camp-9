var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');
var check = require('../middleware/isLoggedIn');

//NEW COMMENT
router.get("/new", check, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err)
        } else {
        res.render("comments/new", {campground: campground})
        }
    });
})

//CREATE COMMENT
router.post("/", check, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    res.redirect('/campgrounds')
                } else {
                    // first add username and id
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                }
                //redirect
                res.redirect(`/campgrounds/${req.params.id}`)
            });
        }
    });
});

module.exports = router;