const mongoose 	= require("mongoose");

var orderSchema = new mongoose.Schema({
    itemName: String,
    itemImage: String,
    itemDescription: String,
    itemPrice: String,
	itemID: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item"
		}
	},
    buyerName: String,
    buyerEmail: String,
	buyerPhone: String,
	buyerStreetAddress: String,
	buyerCityState: String,
	buyerMessage: String,
	dateTime: String,
	paid: Boolean
});

module.exports = mongoose.model("Order", orderSchema);