
// config/db.js

// Import the mongoose library, which is an Object Data Modeling (ODM) library for MongoDB and Node.js.
// It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
const mongoose = require('mongoose');

// This function establishes a connection to the MongoDB database.
const connectDB = async () => {
  try {
    // mongoose.connect() is an asynchronous function that establishes a connection to a MongoDB server.
    // The first argument is the MongoDB connection URI. Here, 'mongodb://localhost:27017/realtimchatapp' specifies the protocol (mongodb),
    // the host (localhost), the port (27017), and the database name (realtimchatapp).
    // The options object { useNewUrlParser: true, useUnifiedTopology: true } is used to avoid deprecation warnings from the MongoDB driver.
    await mongoose.connect('mongodb://localhost:27017/realtimchatapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // If the connection is successful, this message will be logged to the console.
    console.log('MongoDB connected...');
  } catch (err) {
    // If an error occurs during the connection attempt, the error message will be logged to the console.
    console.error(err.message);
    // process.exit(1) will terminate the Node.js process with an exit code of 1, which indicates an error.
    // This is done because the application cannot function without a database connection.
    process.exit(1);
  }
};

// Export the connectDB function to be used in other parts of the application, such as the main app.js file.
module.exports = connectDB;
