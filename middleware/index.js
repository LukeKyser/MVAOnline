const Item = require("../models/item");

module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkUserItem: function(req, res, next){
        if(req.isAuthenticated()){
            next();
        } else {
            req.flash("error", "You don't have permission to do that!");
            console.log("BADD!!!");
            res.redirect("/items/" + req.params.id);
        }
    }
};



