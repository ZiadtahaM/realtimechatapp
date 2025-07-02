
// middleware/auth.js

// Import jsonwebtoken for token verification.
const jwt = require('jsonwebtoken');
// Import the JWT secret from the configuration.
const config = require('../config/jwt');

// This middleware function will protect routes that require authentication.
module.exports = function(req, res, next) {
  // Get token from header.
  // The token is typically sent in the 'x-auth-token' header.
  const token = req.header('x-auth-token');

  // Check if no token is present.
  if (!token) {
    // If there's no token, return a 401 (Unauthorized) status with a message.
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token.
    // jwt.verify() decodes the token using the secret.
    // If the token is valid, it returns the decoded payload.
    const decoded = jwt.verify(token, config.secret);

    // Attach the user from the token payload to the request object.
    // This makes the user's ID available in subsequent route handlers.
    req.user = decoded.user;
    next(); // Call the next middleware or route handler.
  } catch (err) {
    // If token verification fails (e.g., invalid token, expired token), return a 401 status.
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
