//yhe bckend form validation hai iss isko karne se koi hoppscotch request se data nahi aayega
// agar aayegi to error throw karega

const Joi = require('joi');
// Schema for validating listing data
// The listing should have a title, description, location, country, price, and an optional
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(), // price should be a number, not string
        image: Joi.string().allow("", null)
    }).required()
});

// Schema for validating review data
// The review should have a rating and an optional comment

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // rating should be a number between 1 and 5
        comment: Joi.string().required()
    }).required()
})