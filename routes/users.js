const express = require("express");
const passport = require("passport");
const catchAsync = require("../helpers/catchAsync");
const users = require("../controllers/users");
const { isLoggedIn, storeReturnTo } = require("../middlewares/authMiddleware");
const { validateUser } = require("../middlewares/validationMiddleware");

const router = express.Router();

// Use router.route() method on all routes
router.route("/login")
    .get(users.login)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.postLogin);

router.route("/logout")
    .get(isLoggedIn, users.logout);

router.route("/register")
    .get(users.register)
    .post(validateUser, catchAsync(users.postRegister));

router.route("/profile")
    .get(isLoggedIn, users.profile);

module.exports = router;
