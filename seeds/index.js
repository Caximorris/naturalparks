const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, placedescription } = require('./seedHelpers');
const Naturalpark = require('../models/naturalpark');
const Review = require('../models/reviews');

mongoose.connect('mongodb://localhost:27017/naturalpark')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Naturalpark.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random35 = Math.floor(Math.random() * 35);
        const randomprice = Math.floor(Math.random() * 20) + 10;
        const camp = new Naturalpark({
            location: `${cities[random35].city}, ${cities[random35].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            tourprice: randomprice,
            image: [
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: 'NaturalPark/IMG_20211016_131941.jpg'
                },
            ],
            description: `${sample(placedescription)}`,
            owner: '6615bbd6e49061ab18bb0e43' // this is the user id of the user who created the seed data
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})