const Naturalpark = require('../models/naturalpark');
const Review = require('../models/reviews');
const User = require('../models/user');
const { cloudinary } = require("../cloudinary");

const index = async (req, res) => {
    const naturalparks = await Naturalpark.find({});
    res.render("naturalparks/index", { naturalparks });
};

const newPark = (req, res) => {
    res.render("naturalparks/newpark");
};

const createPark = async (req, res) => {
    const newNaturalpark = new Naturalpark(req.body.naturalpark);
    const userOwner = await User.findById(req.user._id);
    newNaturalpark.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newNaturalpark.owner = req.user._id;
    await newNaturalpark.save();
    userOwner.naturalParks.push(newNaturalpark._id);
    req.flash("success", "Successfully created a new natural park!");
    res.redirect(`/naturalparks/${newNaturalpark._id}`);
};

const showPark = async (req, res) => {
    const naturalpark = await Naturalpark.findById(req.params.id).populate("owner");
    res.render("naturalparks/show", { naturalpark });
};

const editPark = async (req, res) => {
    const naturalpark = await Naturalpark.findById(req.params.id);
    res.render("naturalparks/edit", { naturalpark });
};

const reviews = async (req, res) => {
    const naturalpark = await Naturalpark.findById(req.params.id).populate({path: "reviews", populate: {path: "owner"}});
    res.render("naturalparks/reviews", { naturalpark});
};

const updatePark = async (req, res) => {
    const { id } = req.params;
    const naturalpark = await Naturalpark.findByIdAndUpdate(id, { ...req.body.naturalpark });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    naturalpark.image.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await naturalpark.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    await naturalpark.save();
    req.flash("success", "Successfully updated the natural park!");
    res.redirect(`/naturalparks/${naturalpark._id}`);
};

const deletePark = async (req, res) => {
    const { id } = req.params;
    await Naturalpark.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user._id, { $pull: { naturalParks: id } });
    req.flash("success", "Successfully deleted the natural park!");
    res.redirect("/naturalparks");
};

const addReview = async (req, res) => {
    const { id } = req.params;
    const { rating, body } = req.body.review;
    const review = new Review({ rating, body });
    review.owner = req.user._id;
    const naturalpark = await Naturalpark.findById(id);
    const userOwner = await User.findById(req.user._id);
    naturalpark.reviews.push(review._id);
    userOwner.reviews.push(review._id);
    await Promise.all([review.save(), naturalpark.save(), userOwner.save()]);
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/naturalparks/${naturalpark._id}`);
};

const deleteReview = async (req, res) => {
    const { parkId, id } = req.params;
    const naturalpark = await Naturalpark.findByIdAndUpdate(parkId, { $pull: { reviews: id } });
    await Review.findByIdAndDelete(id);
    await naturalpark.save();
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/naturalparks/${parkId}`);
};

module.exports = { index, newPark, createPark, showPark, editPark, reviews, updatePark, deletePark, addReview, deleteReview};