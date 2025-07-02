
// controllers/userController.js

// Import the User model to interact with user data in the database.
const User = require('../models/User');
// Import jsonwebtoken for creating and signing JWTs.
const jwt = require('jsonwebtoken');
// Import the JWT secret from the configuration.
const config = require('../config/jwt');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
exports.registerUser = async (req, res) => {
  // Extract username, email, and password from the request body.
  const { username, email, password } = req.body;

  try {
    // Check if a user with the given email already exists.
    let user = await User.findOne({ email });
    if (user) {
      // If user exists, return a 400 (Bad Request) status with an error message.
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new User instance with the provided data.
    user = new User({
      username,
      email,
      password
    });

    // Save the new user to the database.
    // The pre-save hook in the User model will hash the password before saving.
    await user.save();

    // Create a payload for the JWT. This payload will contain the user's ID.
    const payload = {
      user: {
        id: user.id // Mongoose models have an 'id' virtual getter for '._id'.
      }
    };

    // Sign the JWT.
    // jwt.sign() creates a new token.
    // The first argument is the payload.
    // The second argument is the secret key from our configuration.
    // The third argument is an options object, here specifying the token's expiration time (1 hour).
    // The fourth argument is a callback function that handles the result of the signing process.
    jwt.sign(
      payload,
      config.secret,
      { expiresIn: 3600 }, // Token expires in 1 hour (3600 seconds).
      (err, token) => {
        if (err) throw err; // If an error occurs during signing, throw it.
        // If successful, return a 200 (OK) status with the generated token.
        res.json({ token });
      }
    );
  } catch (err) {
    // If any other error occurs during the process, log it and return a 500 (Server Error) status.
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
  // Extract email and password from the request body.
  const { email, password } = req.body;

  try {
    // Check if a user with the given email exists.
    let user = await User.findOne({ email });
    if (!user) {
      // If user does not exist, return a 400 (Bad Request) status with an error message.
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare the provided password with the hashed password stored in the database.
    // The comparePassword method is defined in the User model.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // If passwords do not match, return a 400 (Bad Request) status with an error message.
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create a payload for the JWT, similar to registration.
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign the JWT, similar to registration.
    jwt.sign(
      payload,
      config.secret,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    // If any other error occurs, log it and return a 500 (Server Error) status.
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Find the user by ID. req.user.id is populated by the auth middleware.
    // .select('-password') excludes the password field from the returned user object for security.
    const user = await User.findById(req.user.id).select('-password');
    // Return the user object.
    res.json(user);
  } catch (err) {
    // If an error occurs, log it and return a 500 (Server Error) status.
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
