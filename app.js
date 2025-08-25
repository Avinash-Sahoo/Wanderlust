const express = require('express')
const app = express()
const ejs = require('ejs')
const port = 8080;
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
require("dotenv").config()

const passport = require('passport');
const localStrategy = require('passport-local')
const user = require('./models/user.js');
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


const MONGO_URL = process.env.MONGODB_URL
// const MONGO_URL = "mongodb+srv://avinashsahoo78:Bunty2003@wandercluster.vkavagu.mongodb.net/wanderlust"
main()
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(MONGO_URL)
}

// Middleware
app.use(methodOverride('_method'))
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
const sessonOptions = {
    secret: 'mysupersecretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week  
        httpOnly: true
    }
}
// Setting up session and flash middleware
app.use(session(sessonOptions));
app.use(flash());
// Passport configuration for user authentication
app.use(passport.initialize()); // Initialize passport for authentication
app.use(passport.session()); // Use session for persistent login sessions
passport.use(new localStrategy(user.authenticate())); // Use local strategy for authentication
passport.serializeUser(user.serializeUser()); // Serialize user for session management
passport.deserializeUser(user.deserializeUser()); // Deserialize user for session management

// Middleware to set flash messages and user data in locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    // console.log(res.locals.success);
    res.locals.error = req.flash('error');
    // res.locals.currentUser = req.session.user;
    res.locals.currUser = req.user; // Set current user for views
    next();
});


// app.get('/demouser', async (req, res) => {
//     let fakeuser = new user({
//         email: 'student1@gmail.com',
//         username: 'student1',
//     });
//     const newUser = await user.register(fakeuser, 'student1234');
//     res.send(newUser);
// })

// Routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


// Catch-all for undefined routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    const {
        statusCode = 500, message = 'Something went wrong'
    } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", {
        message
    });
});

app.listen(port, () => {
    console.log('server is working on 8080')
})