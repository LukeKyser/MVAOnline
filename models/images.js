const mongoose = require("mongoose");

var imagesSchema = new mongoose.Schema({
	img1: String,
	img2: String
});

module.exports = mongoose.model("Images", imagesSchema);