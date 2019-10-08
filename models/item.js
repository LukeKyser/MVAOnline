const mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
	name: String,
	description: String,
	size: String,
	price: String,
	canvas: String,
	profile: String,
	images: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Images"
		}
	}
});

module.exports = mongoose.model("Item", itemSchema);