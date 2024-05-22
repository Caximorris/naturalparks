const Joi = require('joi');
const ExpressError = require('../helpers/exError');

const validateSchema = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
}).required();

const naturalparkSchema = Joi.object({
    naturalpark: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.array().items(Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required()
        })).required(),
        description: Joi.string().required(),
        tourprice: Joi.number().required().min(0),
        averageRating: Joi.number().default(0)
    }).required(),
    deleteImages: Joi.array()
}).required();

const userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).required()
}).required();

const userUpdaterSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().optional().allow(''),
        confirmPassword: Joi.string().optional().allow(''),
    }).required()
}).required();

const validateNaturalpark = validateSchema(naturalparkSchema);
const validateReview = validateSchema(reviewSchema);
const validateUser = validateSchema(userSchema);
const validateUserUpdate = validateSchema(userUpdaterSchema);

module.exports = {
    validateNaturalpark,
    validateReview,
    validateUser,
    validateUserUpdate
};
