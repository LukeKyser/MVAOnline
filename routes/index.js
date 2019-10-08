const express		= require("express");
const router		= express.Router();
const passport		= require("passport");
const User			= require("../models/user");
const Report		= require("../models/report");
const Images		= require("../models/images");
const Contact		= require("../models/contact");
const middleware 	= require("../middleware");


// LANDING
router.get("/", function(req, res){
    res.render("landing");
});


// GALLERY
router.get("/gallery", function(req, res){
	Images.find({}, function(err, allImages){
		if(err){
			console.log(err);
		} else {
			res.render("gallery", {images: allImages});
		}
    });
});
router.delete("/gallery/:id", function(req, res){
	Images.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Delete Error");
		} else {
			res.redirect("/gallery");
		}
	});
});


// REPORT
router.get("/reports", middleware.isLoggedIn, function(req, res){
	Report.find({}, function(err, allReports){
       if(err){
           console.log(err);
		} else {
    		res.render("reports", {reports: allReports});
		}
    });
});


// DELETE
router.delete("/:reportId/remove", function(req, res){
    Report.findByIdAndRemove(req.params.reportId, function(err){
        if(err){
            console.log("Delete Error");
        } else {
            res.redirect("/reports");
        }
    });
});


// REGISTER
router.get("/register", function(req, res){
   res.render("register"); 
});
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/items"); 
        });
    });
});


// LOGIN
router.get("/login", function(req, res){
	res.render("login"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
});


// LOGOUT
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/");
});


module.exports = router;