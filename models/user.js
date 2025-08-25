const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // Importing passport-local-mongoose for user authentication

// User schema definition
// This schema will be used to store user information in the database
// It includes fields for email and password, and uses passport-local-mongoose for authentication features  

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

});
userSchema.plugin(passportLocalMongoose); // Adding passport-local-mongoose plugin to the user schema for authentication features

// Middleware to hash the password before saving the user

const User = mongoose.model("User", userSchema);
module.exports = User;