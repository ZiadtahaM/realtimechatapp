
// routes/api/users.js

// Import the Express router.
const express = require('express');
const router = express.Router();
// Import the user controller functions.
const userController = require('../../controllers/userController');
// Import the authentication middleware.
const auth = require('../../middleware/auth');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
// This route handles new user registration. It uses the registerUser function from the userController.
router.post('/register', userController.registerUser);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
// This route handles user login and token generation. It uses the loginUser function from the userController.
router.post('/login', userController.loginUser);

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
// This route fetches the profile of the currently authenticated user.
// It uses the 'auth' middleware to protect the route, ensuring only authenticated users can access it.
// Then, it uses the getMe function from the userController to retrieve the user's data.
router.get('/me', auth, userController.getMe);

// Export the router to be used in the main application file (app.js).
module.exports = router;
