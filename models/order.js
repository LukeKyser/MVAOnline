const mongoose 	= require("mongoose");

var orderSchema = new mongoose.Schema({
    itemName: String,
    itemImage: String,
    itemDescription: String,
    itemPrice: String,
    buyerName: String,
    buyerEmail: String,
	buyerPhone: String,
	buyerStreetAddress: String,
	buyerCityState: String,
	buyerMessage: String,
	dateTime: String
});

module.exports = mongoose.model("Order", orderSchema);