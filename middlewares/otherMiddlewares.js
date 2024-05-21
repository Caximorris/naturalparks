const session = require('express-session');
const methodOverride = require('method-override');
const express = require('express');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const MongoStore = require('connect-mongo');

function otherMiddlewares(app, sessionSecret, dbUrl) {
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        store: MongoStore.create({ 
            mongoUrl: dbUrl
         }),
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        next();
    });
}

module.exports = otherMiddlewares;