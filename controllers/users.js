const User = require("../models/user");
const Review = require("../models/reviews");
const NaturalPark = require("../models/naturalpark");

const login = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/naturalparks");
    }
    res.render("users/login");
};

const postLogin = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/naturalparks";
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    req.flash("success", "Goodbye!");
    res.redirect("/naturalparks");
};

const register = (req, res) => {
    res.render("users/register");
};

const postRegister = async (req, res, next) => {
    const { email, username, password } = req.body.user;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to NaturalParks!");
        res.redirect("/naturalparks");
    });
};

const profile = (req, res) => {
    res.render("users/profile", { user: req.user });
};

const editProfile = (req, res) => {
    res.render("users/editProfile", { user: req.user });
};

const putProfile = async (req, res) => {
    const { username, email, password } = req.body.user;
    let user = await User.findById(req.user._id);
    user.username = username;
    user.email = email;
    if (password) {
        user.setPassword(password);
    }
    await user.save();
    req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success", "Profile updated!");
        res.redirect("/profile");
    });
}

const deleteProfile = async (req, res) => {
    await User.findByIdAndDelete(req.user._id);
    const userReviews = await Review.find({ owner: req.user._id });
    for (let review of userReviews) {
        const park = await NaturalPark.findById(review.park);
        park.reviews.remove(review._id);
        park.save();
    }
    await Review.deleteMany({ owner: req.user._id });
    await NaturalPark.deleteMany({ _id: { $in: req.user.naturalParks } });
    req.flash("success", "We're sad to see you go!");
    res.redirect("/naturalparks");
};

module.exports = { login, postLogin, logout, register, postRegister, profile, editProfile, putProfile, deleteProfile };
