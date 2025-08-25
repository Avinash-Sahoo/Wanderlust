//this model is used to create a review for a product and it is proper one to many relationship because listing can have many reviews but review can only belong to one listing
//hum har ek listing ke sath ek array of reviews ka array rakh sakte hain
//to uss ke ley hum ek model banayenge jisme hum review ka schema define karenge joki niche ready hai
// aur uske baad hum usko export karenge taake hum isko use kar sakein
// is model ko use karne ke ley hum isko import karenge aur isko use karenge
//hum listing model ke scema me review ka array ko add karenge
const {
    types,
    ref
} = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})
module.exports = mongoose.model('Review', reviewSchema);