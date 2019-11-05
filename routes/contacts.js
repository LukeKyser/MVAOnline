const express		= require("express");
const router		= express.Router();
const passport		= require("passport");
const User			= require("../models/user");
const Report		= require("../models/report");
const Images		= require("../models/images");
const Contact		= require("../models/contact");
const middleware 	= require("../middleware");
const date 			= require('date-and-time');


//INDEX
router.get("/", middleware.isLoggedIn, function(req, res){
	Contact.find({}, function(err, allContacts){
		if(err){
			console.log(err);
		} else {
			res.render("contacts/index", { contacts: allContacts });
		}
	});
});


//NEW
router.get("/new", function(req, res){
	const pop = false
	res.render("contacts/new", { popup: pop });
});

//CREATE
router.post("/new", function(req, res){
	const tempTime 		= new Date();
	const dateTimePST	= date.addHours(tempTime, -7);
	const dateTime		= date.format(dateTimePST, 'YYYY/MM/DD HH:mm:ss');
	
	const newContact = { 
		name: req.body.name, 
		email: req.body.email, 
		phone: req.body.phone, 
		dateTime: dateTime, 
		subject: req.body.subject, 
		message: req.body.message,
		read: false
	};
	
	Contact.create(newContact, function(err){
		if(err){
			console.log(err);
		} else {
			const pop = true;
			res.render("contacts/new", { popup: pop });
		}
	});
});

//SHOW
router.get("/:id", function(req, res){
	Contact.findById(req.params.id, function(err, foundContact){
		if(err){
			console.log(err);
		} else {
			foundContact.read = true;
			Contact.findByIdAndUpdate(req.params.id, foundContact, function(err, updatedContact){
				if(err){
					console.log(err);
				} else {
					res.render("contacts/show", { contact: updatedContact });
				}
			});
		}
	});
});


//DELETE
router.delete("/:id", function(req, res){
	Contact.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Delete Error");
		} else {
			res.redirect("/contacts");
		}
	});
});

module.exports = router;