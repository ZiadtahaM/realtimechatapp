
// config/jwt.js

// This module exports a configuration object for JWT.
module.exports = {
  // The 'secret' is a string that is used to sign and verify JSON Web Tokens (JWTs).
  // It is crucial that this secret is kept confidential.
  // In a production environment, this secret should be stored securely, for example, in an environment variable,
  // and should be a long, complex, and random string to ensure the security of the tokens.
  secret: 'your_jwt_secret'
};
