const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_960_720.jpg',
        set: (v) => v === "" ?
            "https://plus.unsplash.com/premium_vector-1697729804286-7dd6c1a04597?q=80&w=1070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    // This is a one-to-many relationship with reviews
    // Each listing can have multiple reviews, but each review belongs to one listing
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    // This is a many-to-one relationship with users
    // Each listing is owned by one user, but a user can own multiple listings
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }

});
// Middleware to delete reviews when a listing is deleted
// This will ensure that when a listing is deleted, all associated reviews are also deleted
listingSchema.post('findOneAndDelete', async function (listing) {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;