require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const { createApi } = require('unsplash-js');
const nodeFetch = require('node-fetch');
const cities = require('./cities');
const { places, descriptors, placedescription } = require('./seedHelpers');
const { cloudinary } = require('../cloudinary');
const Naturalpark = require('../models/naturalpark');
const Review = require('../models/reviews');
const User = require('../models/user');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/naturalparks'; //create a new .env in this folder or insert the url here
const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    fetch: nodeFetch
});

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const deleteAllCloudinaryImages = async () => {
    try {
        const result = await cloudinary.api.delete_resources_by_prefix('NaturalParks/');
        console.log('Deleted all images in NaturalParks folder:', result);
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        throw error;
    }
};

const uploadImageToCloudinary = async (imageUrl, publicId) => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ public_id: publicId, folder: 'NaturalParks' }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }).end(buffer);
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};

const getRandomNatureImageUrl = async () => {
    try {
        const result = await unsplash.photos.getRandom({
            query: 'nature',
            count: 1,
        });
        if (result.type === 'success') {
            const rawUrl = result.response[0].urls.raw;
            const urlWithResolution = `${rawUrl}&w=1080&h=720&fit=crop`;
            return urlWithResolution;
        } else {
            throw new Error('Error fetching random nature image from Unsplash');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const seedDB = async () => {
    await deleteAllCloudinaryImages();
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

        const imageUrl = await getRandomNatureImageUrl();
        const cloudinaryUrl = await uploadImageToCloudinary(imageUrl, `naturalpark_image_${i}`);
    
        const park = new Naturalpark({
            location: `${cities[random35].city}, ${cities[random35].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            tourprice: randomprice,
            image: [
                {
                    url: cloudinaryUrl,
                    filename: `naturalpark_image_${i}`
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