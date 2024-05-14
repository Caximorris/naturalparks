const express = require("express");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const catchAsync = require('../helpers/catchAsync');
const naturalparks = require('../controllers/naturalparks');
const { isLoggedIn, isOwnerOfPark, isOwnerOfReview } = require('../middlewares/authMiddleware');
const { validateNaturalpark, validateReview } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.route("/")
    .get(catchAsync(naturalparks.index))
    .post(isLoggedIn, upload.array('image'), validateNaturalpark, catchAsync(naturalparks.createPark));

router.route("/newpark")
    .get(isLoggedIn, naturalparks.newPark);

router.route("/:id")
    .get(catchAsync(naturalparks.showPark))
    .put(isLoggedIn, isOwnerOfPark, upload.array('image'), validateNaturalpark, catchAsync(naturalparks.updatePark))
    .delete(isLoggedIn, isOwnerOfPark, catchAsync(naturalparks.deletePark));

router.route("/:id/edit")
    .get(isLoggedIn, isOwnerOfPark, catchAsync(naturalparks.editPark));

router.route("/:id/reviews")
    .get(catchAsync(naturalparks.reviews));

router.route("/:id/reviews")
    .post(isLoggedIn, validateReview, catchAsync(naturalparks.addReview));

router.route("/:parkId/reviews/:id")
    .delete(isLoggedIn, isOwnerOfReview, catchAsync(naturalparks.deleteReview));

module.exports = router;
