require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, placedescription } = require('./seedHelpers');
const Naturalpark = require('../models/naturalpark');
const Review = require('../models/reviews');
const User = require('../models/user');
const dbUrl = 'mongodb://localhost:27017/naturalpark'; //create a new .env in this folder or insert database url here

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Naturalpark.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.dropCollection('sessions');

    const password = 'admin'; //create a new .env in this folder or insert password here
    const adminUser = new User({ email: 'admin@admin.com', username: 'admin' });
    const registeredUser = await User.register(adminUser, password);

    for (let i = 0; i < 50; i++) {
        const random35 = Math.floor(Math.random() * 35);
        const randomprice = Math.floor(Math.random() * 20) + 10;
        const park = new Naturalpark({
            location: `${cities[random35].city}, ${cities[random35].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            tourprice: randomprice,
            image: [
                {
                    url: `https://source.unsplash.com/random/1080x720?nature&${i}`,
                    filename: 'NaturalPark/IMG_20211016_131941.jpg'
                },
            ],
            description: `${sample(placedescription)}`,
            owner: registeredUser._id
        })
        await park.save();
        registeredUser.naturalParks.push(park._id);
    }
    await registeredUser.save();
}

seedDB().then(() => {
    mongoose.connection.close();
})