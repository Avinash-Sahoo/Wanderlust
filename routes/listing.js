const express = require('express');
const router = express.Router({
    mergeParams: true
}); // Allows access to listing ID in review routes

const wrapAsync = require('../utils/WrapAsync.js')

const {
    listingSchema
} = require('../schema.js')
// const Review = require('../models/review.js')
const Listing = require('../models/listing.js');



// Middleware to check if user is logged in
const {
    isLoggedIn,
    isOwner,
    validateListing,
    saveRedirectUrl
} = require('../middleware.js');



//index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index", {
        allListings
    })
}))

// new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render('listings/new')
})
//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, 'send valid data fror listing')
    // }
    let result = listingSchema.validate(req.body)
    // console.log(result)
    if (result.error) {
        throw new ExpressError(400, result.error)
    }
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Successfully created a new listing!') // Flash message for success
    res.redirect('/listings')
}))

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('owner');
    if (!listing) {
        req.flash('error', "Listing you requested does not exist")
        req.redirect('/listings')
    }
    // console.log(listing); // Ab yaha user ka document dikhna chahiye
    res.render("listings/show", {
        listing
    });
}));

//edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {
        id
    } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist');
        return res.redirect('/listings');
    }
    res.render("listings/edit", {
        listing
    })
}))
//update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, 'send valid data fror listing')
    }
    let {
        id
    } = req.params;

    await Listing.findByIdAndUpdate(id, {
        ...req.body.listing
    })
    req.flash('success', 'Successfully updated the listing!') // Flash message for update
    res.redirect(`/listings/${id}`)
}))

//delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {
        id
    } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted the listing!') // Flash message for deletion
    res.redirect(`/listings`)
}))

module.exports = router;