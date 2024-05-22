const mongoose = require('mongoose');
const Review = require('./reviews');
const User = require('./user');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const naturalParkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: [imageSchema],
    tourprice: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    }
});

naturalParkSchema.post('findOneAndDelete', async function (naturalPark) {
    await User.updateMany({ $pull: { reviews: naturalPark.reviews } });
    await Review.deleteMany({ _id: { $in: naturalPark.reviews } });
});

naturalParkSchema.methods.updateAverageRating = async function () {
    const naturalPark = await this.populate('reviews');
    if (naturalPark.reviews.length) {
        const totalRating = naturalPark.reviews.reduce((acc, curr) => acc + curr.rating, 0);
        naturalPark.averageRating = Math.round(totalRating / naturalPark.reviews.length * 10) / 10;
    } else {
        naturalPark.averageRating = 0;
    }
};

naturalParkSchema.pre('save', async function (next) {
    await this.updateAverageRating();
    next();
});

const NaturalPark = mongoose.model('NaturalPark', naturalParkSchema);

module.exports = NaturalPark;
