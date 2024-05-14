**Welcome to NaturePark Upload Web App**

This repository houses a web application designed to facilitate the upload and management of natural parks. Whether you're an enthusiast sharing your favorite spots or a professional cataloging biodiversity, this platform streamlines the process.

### Features:

1. **User Authentication:** Securely log in to your account to access the platform's features. User authentication ensures that only authorized individuals can upload and manage park data.

2. **Park Upload:** Easily upload details and images of natural parks. Provide comprehensive information about each park, including location, description, and tour pricing.

3. **Seeder Initialization:** Initialize the seeder to populate the MongoDB database with a predefined set of natural parks. This feature ensures that users have access to a diverse range of parks from the get-go, enhancing the platform's usability and appeal.

4. **Cloudinary Integration:** Seamlessly upload park images to Cloudinary, a cloud-based image management solution. By leveraging Cloudinary's robust features, users can store and manage their park images efficiently, ensuring fast loading times and optimal performance.

### Getting Started:

To get started with the NaturePark Upload Web App, follow these steps:

1. **Clone the Repository:** Clone this repository to your local machine using the following command:
   ```
   git clone https://github.com/Caximorris/naturalparks
   ```

2. **Install Dependencies:** Navigate to the project directory and install the necessary dependencies by running:
   ```
   npm install
   ```

3. **Initialize Seeder:** Run the seeder initialization script (inside the seeds folder) to populate the MongoDB database with sample park data:
   ```
   nodemon index.js
   ```

4. **Set Up Cloudinary Account:** Create a Cloudinary account if you haven't already. Obtain your Cloudinary API credentials (Cloud Name, API Key, API Secret) to enable image uploads.

5. **Configure Environment Variables:** Set up environment variables for MongoDB connection and Cloudinary credentials (.env).

6. **Start the Server:** Launch the web application by running this on the main folder (the default port is 3000):
   ```
   nodemon app.js
   ```

7. **Explore and Upload:** Access the web application through your preferred browser. Log in to your account, explore existing parks, and upload new parks with ease.

### Feedback and Support:

Have feedback or need assistance? I'm here to help! Reach out to me through GitHub issues for prompt assistance.
