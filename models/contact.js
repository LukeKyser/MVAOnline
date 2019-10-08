const mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
	name: String,
	email: String,
	phone: String,
	dateTime: String,
	subject: String,
	message: String,
	read: Boolean
});

module.exports = mongoose.model("Contact", contactSchema);