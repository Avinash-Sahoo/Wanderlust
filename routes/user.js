const express = require('express');
const router = express.Router(); // Allows access to listing ID in review routes
const User = require('../models/user.js'); //

const wrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const {
    saveRedirectUrl
} = require('../middleware.js');
const Listing = require('../models/listing.js');

router.get('/signup', (req, res) => {
    res.render('users/signup');
})

// router.get("/", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({})
//     res.render("listings/index", {
//         allListings
//     })
// }))

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const {
            username,
            password,
            email
        } = req.body;
        const newUser = new User({
            username,
            email
        });
        const registerUser = await User.register(newUser, password)
        console.log(registerUser);
        // Automatically log in the user after registration
        req.login(registerUser, (err) => {
            if (err) {
                return next(err); // Handle login error
            }
            req.flash('success', 'Welcome to the Wonderlust');
            res.redirect('/listings');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
    // successFlash: 'Welcome back!'
}), async (req, res) => {
    req.flash("success", 'welcome back to Wonderlust! you are logged in');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    delete req.session.redirectUrl; // Clear the redirect URL after use
    res.redirect(redirectUrl);
})


router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle logout error
        }
        req.flash('success', 'you are Logged out successfully');
        res.redirect('/listings');
    });
});


module.exports = router; // This is the user router for handling user-related routes
