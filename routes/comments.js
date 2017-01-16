var express = require("express");
var middleware = require("../middleware");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
       }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("error", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;