const mongoose = require('mongoose');
const NaturalPark = require('./naturalpark');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    body: {
        type: String,
        required: [true, 'Review body is required']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    park: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NaturalPark'
    }
});

reviewSchema.set('timestamps', true);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
