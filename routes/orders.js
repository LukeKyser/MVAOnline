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
  'mode': 'sandbox', // sandbox or live
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


//NEW
router.get("/:id/new", function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			console.log(err);
		} else {
			res.render("orders/new", {item: foundItem});
		}
	});
});


//PAY
router.post("/:id/pay", function(req, res){
	createOrder(req, req.params.id, false, function(returnedOrder, returnedItem){
		const create_payment_json = {
			"intent": "sale",
			"payer": {
				"payment_method": "paypal"
			},
			"redirect_urls": {
				"return_url": CONST.PAYPAL_REDIRECT_RETURN_URL + returnedOrder._id + "/" + req.params.id + "/success",
				"cancel_url": "/cancel"
			},
			"transactions": [{
				"item_list": {
					"items": [{
						"name": returnedItem.name,
						"sku": "001",
						"price": returnedItem.price,
						"currency": "USD",
						"quantity": 1
					}]
				},
				"amount": {
					"currency": "USD",
					"total": returnedItem.price
				},
				"description": returnedItem.description
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
	});
});

//SUCCESS
router.get('/:orderId/:itemId/success', function(req, res){
  
	createReport(req.params.orderId, function(returnedOrder){
		const payerId = req.query.PayerID;
		const paymentId = req.query.paymentId;

		const execute_payment_json = {
			"payer_id": payerId,
			"transactions": [{
				"amount": {
					"currency": "USD",
					"total": returnedOrder.itemPrice
				}
			}]
		};

		paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
			if (error) {
				console.log(error.response);
				Order.findByIdAndRemove(req.params.orderId, function(err){
					if(err){
						console.log("Delete Error");
					}
				});
				throw error;
			} else {
				res.render("orders/receipt", {order: returnedOrder});
			}
		});
	});
});

//HOLD
router.post("/:id/hold", function(req, res){
	createOrder(req, req.params.id, true, function(returnedOrder, returnedItem){
		res.render("orders/receipt", {order: returnedOrder});
	});
});

//FINALIZE
router.get('/:orderId/finalize', function(req, res){
	createReport(req.params.orderId, function(returnedOrder){
		res.redirect("/orders/" + returnedOrder._id);
	});
});


//SHOW
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

function createOrder(req, itemId, hold, callback){
	const tempTime 		= new Date();
	const dateTimePST	= date.addHours(tempTime, -7);
	
	Item.findById(itemId, function(err, foundItem){
		if(err){
			console.log(err);
		} else {
			const newOrder = {
				itemName: foundItem.name,
				itemImage: foundItem.profile,
				itemDescription: foundItem.description,
				itemPrice: foundItem.price,
				itemID: { id: foundItem._id },
				buyerName: req.body.buyerName,
				buyerEmail: req.body.buyerEmail,
				buyerPhone: req.body.buyerPhone,
				buyerStreetAddress: req.body.buyerStreetAddress,
				buyerCityState: req.body.buyerCityState,
				buyerMessage: req.body.buyerMessage,
				dateTime: date.format(dateTimePST, 'YYYY/MM/DD HH:mm:ss'),
				paid: !hold
			};
			
			Order.create(newOrder, function(err, newlyCreatedOrder){
				if(err){
					console.log(err);
				} else {
					foundItem.hold = hold;
					Item.findByIdAndUpdate(foundItem._id, foundItem, function(err){
						if(err){
							console.log(err);
						} else {
							callback(newlyCreatedOrder, foundItem);
						}
					});
				}
			});
		}
	});
}

function createReport(orderId, callback){
	Order.findById(orderId, function(err, foundOrder){
		if(err){
			console.log(err);
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
					Item.findByIdAndRemove(foundOrder.itemID.id, function(err){
						if(err){
							console.log(err);
						} else {
							callback(foundOrder);
						}
					});
				}
			});
		}
	});
}

module.exports = router;

