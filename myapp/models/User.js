
// models/User.js

// Import mongoose to define the schema and model.
const mongoose = require('mongoose');
// Import bcrypt for password hashing.
const bcrypt = require('bcrypt');
const userschmea =new mongoose.Schema({username:{type:String,required:true,unique:true,trime:true},emall:{type:String,required:true,unique:true,lowercase:true},password:{type:String},date:{type:Date,default:Date.now}})
// Define the User Schema.
// A schema maps to a MongoDB collection and defines the shape of the documents within that collection.

userschmea.pre('save',async function (next) {if (!this.isModified('password')){   return next();}
  try{}catch{}
  
})
// Pre-save hook to hash the password before saving the user to the database.
// 'pre("save")' is a Mongoose middleware function that runs before a document is saved to the database.
UserSchema.pre('save', async function(next) {
  // 'this' refers to the document being saved (the user instance).
  // Check if the password field has been modified or if it's a new user.
  if (!this.isModified('password')) {
    return next(); // If the password is not modified, move to the next middleware.
  }

  try {
    // Generate a salt. A salt is random data that is used as an additional input to a one-way function that hashes data, typically a password or passphrase.
    // The '10' is the number of salt rounds, which determines how much time is needed to calculate a single bcrypt hash.
    // The higher the number, the more secure the hash, but also the slower the process.
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt.
    // 'this.password' is the plain-text password from the user input.
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Move to the next middleware or save operation.
  } catch (err) {
    next(err); // Pass any errors to the next middleware.
  }
});

// Method to compare the entered password with the hashed password in the database.
// 'methods.comparePassword' adds a custom method to the UserSchema instance.
UserSchema.methods.comparePassword = async function(candidatePassword) {
  // 'candidatePassword' is the plain-text password provided by the user during login.
  // 'this.password' is the hashed password stored in the database.
  // 'bcrypt.compare()' compares the plain-text password with the hashed password.
  // It returns true if they match, false otherwise.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model based on the UserSchema.
// 'mongoose.model()' compiles a model from the schema.
// The first argument 'User' is the singular name of the collection that will be created in MongoDB (Mongoose pluralizes it to 'users').
// The second argument is the schema to use.
module.exports = mongoose.model('User', UserSchema);
