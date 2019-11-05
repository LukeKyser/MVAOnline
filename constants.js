
//GOORM
const constArr = {
	//LISTEN
	PROCESS_ENV_PORT: 3001,
	PROCESS_ENV_IP: null,
	
	//PAYPAL
	PAYPAL_REDIRECT_RETURN_URL: "https://instabammer.run.goorm.io/orders/",
	PAYPAL_CLIENT_ID: "AckJECtFqvJhOJIY9sp-iuPJOTWQuutLmtIqplecgNGpwWo-nG8tHaHGS1Izgj3kehG305P_Q1ZXPYse",
	PAYPAL_CLIENT_SECRET: "EB23iI0xWnOJswZSfGCyGNptPecjsG9LxuT44HEw1S58KmNN4tE4gOhIAp8LyJvJpnpoKPOJQzzQ76BI",
	
	//CLOUDINARY
	CLOUDINARY_CLOUD_NAME: "lukekysercloud",
	CLOUDINARY_API_KEY: "836755637141421",
	CLOUDINARY_API_SECRET: "2sfLjnRsVFwqQwnqL4FgyqEDt7A",
	
	//MONGODB
	MONGODB_CONNECT_PASSWORD: "mongodb+srv://lukekyser:disciasci0@cluster0-vip1a.mongodb.net/mvadb?retryWrites=true"
}

// HEROKU
// const constArr = {
// 	//LISTEN
// 	PROCESS_ENV_PORT: process.env.PORT,
// 	PROCESS_ENV_IP: process.env.IP,
	
// 	//PAYPAL
// 	PAYPAL_REDIRECT_RETURN_URL: "https://mikeveeserart.herokuapp.com/orders/",
// 	PAYPAL_CLIENT_ID: "AckJECtFqvJhOJIY9sp-iuPJOTWQuutLmtIqplecgNGpwWo-nG8tHaHGS1Izgj3kehG305P_Q1ZXPYse",
// 	PAYPAL_CLIENT_SECRET: "EB23iI0xWnOJswZSfGCyGNptPecjsG9LxuT44HEw1S58KmNN4tE4gOhIAp8LyJvJpnpoKPOJQzzQ76BI",
	
// 	//CLOUDINARY
// 	CLOUDINARY_CLOUD_NAME: "lukekysercloud",
// 	CLOUDINARY_API_KEY: "836755637141421",
// 	CLOUDINARY_API_SECRET: "2sfLjnRsVFwqQwnqL4FgyqEDt7A",
	
// 	//MONGODB
// 	MONGODB_CONNECT_PASSWORD: "mongodb+srv://lukekyser:disciasci0@cluster0-vip1a.mongodb.net/mvadb?retryWrites=true"
// }
 
module.exports = constArr;