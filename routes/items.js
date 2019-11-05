const express 		= require("express");
const router  		= express.Router();
const Item 			= require("../models/item");
const Images 		= require("../models/images");
const middleware 	= require("../middleware");
const request 		= require("request");
const fs 			= require('fs');
const multer 		= require('multer');
const path 			= require('path');
const cloudinary	= require("cloudinary").v2;
const CONST			= require("../constants");

cloudinary.config({
	cloud_name: CONST.CLOUDINARY_CLOUD_NAME,
	api_key: CONST.CLOUDINARY_API_KEY,
	api_secret: CONST.CLOUDINARY_API_SECRET
});

/////////////////////////////////////

//INDEX
router.get("/page/:num", function(req, res){
    Item.find({}, function(err, allItems){
		if(err){
			console.log(err);
		} else {
			const itemSubset = [];
			const itemSet = allItems.reverse();
			const page = parseInt(req.params.num);
			const numPages = Math.ceil(allItems.length / 6);
			const max = page * 6;
			let i = (page - 1) * 6;
			let links = [];
			
			if(numPages < 5){
				for(let p = 1; p <= numPages; p++){
					links.push(p);
				}
			} else {
				if(page < 3)
					links = [1,2,3,4,5];
				else if(page > numPages - 2)
					links = [numPages - 4, numPages - 3, numPages - 2, numPages - 1, numPages];
				else
					links = [page - 2, page - 1, page, page + 1, page + 2];
			}
			for(i; i < allItems.length && i < max; i++){
				itemSubset.push(allItems[i]);
			}
			res.render("items/index", {items: itemSubset, pages: numPages, page: page, links: links});
		}
    });
});


//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	
	const image1 = req.files.image1;
	const image2 = req.files.image2;
	
	cloudinary.uploader.upload(image1.tempFilePath, function(err, resultImage1){
		if(err){
			console.log(err);
		} else {
			cloudinary.uploader.upload(image2.tempFilePath, function(err, resultImage2){
				if(err){
					console.log(err);
				} else {
					const newImages = { img1: resultImage1.url, img2: resultImage2.url };
					
					Images.create(newImages, function(err, newImagesObj){
						if(err){
							console.log(err);
						} else {
							const newItem 		= { 
								name: req.body.name,
								description: req.body.description,
								size: req.body.size,
								price: req.body.price,
								canvas: req.body.canvas,
								profile: newImages.img1,
								images: { id: newImagesObj._id },
								hold: false
							};
							Item.create(newItem, function(err){
								if(err){
									console.log(err);
								} else {
									res.redirect("/items/page/" + 1);
								}
							});
						}
					});
				}
			});
		}
	});
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("items/new"); 
});

//SHOW
router.get("/:id", function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
        } else {
			Images.findById(foundItem.images.id, function(err, foundImages){
				res.render("items/show", {item: foundItem, images: foundImages});
			});
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkUserItem, function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            res.render("items/edit", {item: foundItem});
        }
    });
});

router.put("/:id", function(req, res){
	var itemHold;
	if(req.body.hold == "on"){
		itemHold = true;
	} else {
		itemHold = false;
	}
    var newData = {
		name: req.body.name,
		description: req.body.description,
		size: req.body.size,
		price: req.body.price,
		canvas: req.body.canvas,
		hold: itemHold
	};
	
    Item.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, item){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Item Updated");
            res.redirect("/items/" + item._id);
        }
    });
});

//DELETE
router.delete("/:id", middleware.checkUserItem, function(req, res){
	Item.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("Delete Error");
		} else {
			res.redirect("/items/page/" + 1);
		}
	});
});


module.exports = router;

