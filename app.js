const express			= require("express");
const app				= express();
const bodyParser		= require("body-parser");
const mongoose			= require("mongoose");
const passport			= require("passport");
const cookieParser		= require("cookie-parser");
const LocalStrategy		= require("passport-local");
const flash				= require("connect-flash");
const Item				= require("./models/item");
const User				= require("./models/user");
const session			= require("express-session");
const CONST				= require("./constants");
const methodOverride	= require("method-override");
const fileUpload		= require("express-fileupload");
    
//requiring routes
const itemRoutes		= require("./routes/items");
const indexRoutes		= require("./routes/index");
const contactRoutes		= require("./routes/contacts");
const orderRoutes		= require("./routes/orders");
    
mongoose.connect(CONST.MONGODB_CONNECT_PASSWORD);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(fileUpload({
	useTempFiles: true
  // limits: { fileSize: 50 * 1024 * 1024 },
}));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/items", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/contacts", contactRoutes);



app.listen(CONST.PROCESS_ENV_PORT, CONST.PROCESS_ENV_IP, function(){
   console.log("The MVA Server Has Started!");
});
