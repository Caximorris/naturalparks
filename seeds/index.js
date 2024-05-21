require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, placedescription } = require('./seedHelpers');
const Naturalpark = require('../models/naturalpark');
const Review = require('../models/reviews');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/naturalpark'; //create a new .env in this folder or insert database url here

mongoose.connect("mongodb+srv://caximorris:panchito2008A%40%21@cluster0.xrubyoi.mongodb.net/")

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
                    url: `https://source.unsplash.com/random/1080x720?nature&${i}`,
                    filename: 'NaturalPark/IMG_20211016_131941.jpg'
                },
            ],
            description: `${sample(placedescription)}`,
            owner: '664cb4a9baff3c522828414e' // this is the user id of the user who created the seed data
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})