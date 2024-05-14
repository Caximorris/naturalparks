const ExpressError = require('../helpers/exError');

const notFoundHandler = (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
};

const errorHandler = (err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong." } = err;
    if (err.name === "CastError" && err.kind === "ObjectId") {
        message = "This natural park doesn't exist.";
        statusCode = 404;
    }
    res.status(statusCode).render("errors", { err: { message } });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
