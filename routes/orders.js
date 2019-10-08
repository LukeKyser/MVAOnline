const express			= require("express");
const router			= express.Router();
const Item 				= require("../models/item");
const Images			= require("../models/images");
const Order				= require("../models/order");
const Report			= require("../models/report");
const middleware 		= require("../middleware");
const request 			= require("request");
const paypal 			= require('paypal-rest-sdk');
const date 				= require('date-and-time');
const CONST				= require("../constants");

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': CONST.PAYPAL_CLIENT_ID,
  'client_secret': CONST.PAYPAL_CLIENT_SECRET
});

//INDEX
router.get("/", middleware.isLoggedIn, function(req, res){
	Order.find({}, function(err, allOrders){
		if(err){
			console.log(err);
		} else {
			res.render("orders/index", {orders: allOrders});
		}
	});
});


// NEW
router.get("/:id/new", function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			console.log(err);
		} else {
			res.render("orders/new", {item: foundItem});
		}
	});
});


// PAY
router.post("/:id/pay", function(req, res){
	const tempTime 		= new Date();
	const dateTimePST	= date.addHours(tempTime, -7);
	
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			console.log(err);
		} else {
			const itemName 				= foundItem.name;
			const itemImage 			= foundItem.profile;
			const itemDescription 		= foundItem.description;
			const itemPrice 			= foundItem.price;
			const buyerName 			= req.body.buyerName;
			const buyerEmail 			= req.body.buyerEmail;
			const buyerPhone 			= req.body.buyerPhone;
			const buyerStreetAddress 	= req.body.buyerStreetAddress;
			const buyerCityState 		= req.body.buyerCityState;
			const buyerMessage 			= req.body.buyerMessage;
			const dateTime				= date.format(dateTimePST, 'YYYY/MM/DD HH:mm:ss');
			const newOrder = {
				itemName: itemName,
				itemImage: itemImage,
				itemDescription: itemDescription,
				itemPrice: itemPrice,
				buyerName: buyerName,
				buyerEmail: buyerEmail,
				buyerPhone: buyerPhone,
				buyerStreetAddress: buyerStreetAddress,
				buyerCityState: buyerCityState,
				buyerMessage: buyerMessage,
				dateTime: dateTime
			};
			
			Order.create(newOrder, function(err, newlyCreated){
				if(err){
					console.log(err);
				} else {
					const create_payment_json = {
						"intent": "sale",
						"payer": {
							"payment_method": "paypal"
						},
						"redirect_urls": {
							"return_url": CONST.PAYPAL_REDIRECT_RETURN_URL + newlyCreated._id + "/" + req.params.id + "/success",
							"cancel_url": "/cancel"
						},
						"transactions": [{
							"item_list": {
								"items": [{
									"name": foundItem.name,
									"sku": "001",
									"price": foundItem.price,
									"currency": "USD",
									"quantity": 1
								}]
							},
							"amount": {
								"currency": "USD",
								"total": foundItem.price
							},
							"description": foundItem.description
						}]
					};

					paypal.payment.create(create_payment_json, function (error, payment) {
					  if (error) {
						  throw error;
					  } else {
						  for(let i = 0;i < payment.links.length;i++){
							if(payment.links[i].rel === 'approval_url'){
							  res.redirect(payment.links[i].href);
							}
						  }
					  }
					});
				}
			});
		}
	});
});

// SUCCESS
router.get('/:orderId/:itemId/success', function(req, res){
  
	Order.findById(req.params.orderId, function(err, foundOrder){
		if(err){
			console.log(err);
		} else {
			const payerId = req.query.PayerID;
			const paymentId = req.query.paymentId;

			const execute_payment_json = {
				"payer_id": payerId,
				"transactions": [{
					"amount": {
						"currency": "USD",
						"total": foundOrder.itemPrice
					}
				}]
			};

			paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
				if (error) {
					console.log(error.response);
					Order.findByIdAndRemove(req.params.id, function(err){
						if(err){
							console.log("Delete Error");
						}
					});
					throw error;
				} else {
					var newReport = {
						itemName: foundOrder.itemName,
						itemImage: foundOrder.itemImage,
						itemDescription: foundOrder.itemDescription,
						itemPrice: foundOrder.itemPrice,
						buyerName: foundOrder.buyerName,
						buyerEmail: foundOrder.buyerEmail,
						buyerPhone: foundOrder.buyerPhone,
						buyerStreetAddress: foundOrder.buyerStreetAddress,
						buyerCityState: foundOrder.buyerCityState,
						buyerMessage: foundOrder.buyerMessage,
						dateTime: foundOrder.dateTime
					};
					
					Report.create(newReport, function(err){
						if(err){
							console.log(err);
						} else {
							Item.findByIdAndRemove(req.params.itemId, function(err){
								if(err){
									console.log(err);
								} else {
									res.render("orders/receipt", {order: foundOrder});
								}
							});
						}
					});
				}
			});
		}
	});
});


// SHOW
router.get("/:id", middleware.isLoggedIn, function(req, res){
	Order.findById(req.params.id).exec(function(err, foundOrder){
		if(err){
			console.log(err);
		} else {
			res.render("orders/show", {order: foundOrder});
		}
	});
});


//DELETE
router.delete("/:orderId",middleware.isLoggedIn, function(req, res){
	Order.findByIdAndRemove(req.params.orderId, function(err){
		if(err){
			console.log("Delete Error");
		} else {
			res.redirect("/orders");
		}
    });
});



module.exports = router;

