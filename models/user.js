const mongogoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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

const User = mongogoose.model('User', userSchema);

module.exports = User;