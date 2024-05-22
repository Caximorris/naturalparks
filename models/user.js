const mongogoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Review = require('./reviews');
const NaturalPark = require('./naturalpark');

const userSchema = new mongogoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    naturalParks: [
        {
            type: mongogoose.Schema.Types.ObjectId,
            ref: 'NaturalPark'
        }
    ],
    reviews: [
        {
            type: mongogoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

userSchema.pre('findOneAndDelete', async function (next) {
    const user = await this.model.findOne(this.getQuery());
    if (user) {
        await Review.deleteMany({ _id: { $in: user.reviews } });
        await NaturalPark.deleteMany({ _id: { $in: user.naturalParks } });
    }
    next();
});

const User = mongogoose.model('User', userSchema);

module.exports = User;