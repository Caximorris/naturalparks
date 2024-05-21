if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express");
const path = require("path");
const engine = require('ejs-mate');
const naturalparkRoutes = require('./routes/naturalparkRoutes');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const { connectToDatabase } = require('./helpers/database');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandlers');
const otherMiddlewares = require('./middlewares/otherMiddlewares');

// Create the express app
const app = express();
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/naturalpark';
const sessionSecret = process.env.SESSION_SECRET || 'thisshouldbeabettersecret!';

// Connect to the database
connectToDatabase(dbUrl);

// Set up view engine and middleware
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
otherMiddlewares(app, sessionSecret, dbUrl);

// Routes
app.use("/", indexRoutes);
app.use("/naturalparks", naturalparkRoutes);
app.use("/", userRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
