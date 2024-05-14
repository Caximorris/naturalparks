const mongogoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongogoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongogoose.model('User', userSchema);

module.exports = User;