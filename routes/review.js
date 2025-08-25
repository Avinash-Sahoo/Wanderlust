const express = require('express');
const router = express.Router({
    mergeParams: true
});

const wrapAsync = require('../utils/WrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')

const Review = require('../models/review.js')
const Listing = require('../models/listing.js');

const {
    validateReview,
    isLoggedIn,
    isReviewAuthor
    
} = require('../middleware.js')


//Post Review Route 
// This route allows users to add reviews to a listing post route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listen = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listen.reviews.push(newReview);
    await newReview.save();
    await listen.save();
    req.flash('success', 'Successfully created  new review') // Flash message for deletion

    res.redirect(`/listings/${listen._id}`)
    // console.log(listen.reviews)
}))

// Delete review route
//pull oppertaion is used to remove the review from the listing
// and then delete the review from the database

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let {
        id,
        reviewId
    } = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!') // Flash message for deletion

    res.redirect(`/listings/${id}`)
}))
module.exports = router;