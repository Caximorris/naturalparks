const Naturalpark = require("../models/naturalpark");
const Review = require("../models/reviews");

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

const isOwnerOf = (model) => async (req, res, next) => {
    const item = await model.findById(req.params.id);
    if (item === null || req.user.id !== item.owner.toString()) {
        req.flash("error", "You are not authorized to do that!");
        return res.redirect(`/naturalparks/${req.params.id}`);
    }
    next();
};

const isOwnerOfPark = isOwnerOf(Naturalpark);
const isOwnerOfReview = isOwnerOf(Review);

module.exports = { isLoggedIn, storeReturnTo, isOwnerOfPark, isOwnerOfReview };
