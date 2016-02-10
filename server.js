var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var appConfig = require('./config/appConfig.js');
var nodemailer = require('nodemailer');

var dbName = 'dboutdoorsy';
var urlToConnect = 'mongodb://localhost/' + dbName;

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    urlToConnect = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
                   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
                   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
                   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
                   process.env.OPENSHIFT_APP_NAME;
}

console.log("connected to " + urlToConnect);
mongoose.connect(urlToConnect);

//---------------------- Boiler Plate Code ----------------------//
app.use(express.static(__dirname + '/outdoorsy_app'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: "SecretSession" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Redirect To Home Page
app.get('/', function (req, res){
    res.redirect(appConfig.appConfig.baseURL);
})
// Redirect To Home Page
app.get('/home', function (req, res){
    res.redirect(appConfig.appConfig.baseURL);
})

// ----------------------- Userschema and User functions ---------------------- //
var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
    facebookId: String,
    facebookToken: String,
    profilePic : String,
    accountActivated : Boolean,
	preferences: {
        searchRadius : Number,
        modeOfTransport : [String],
        subCategories : [String]
    }
}, {collection: 'users'});

var OutdoorsyUserModel = mongoose.model("users", UserSchema);

// Passport Local Strategy For Authentication
passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, function (username, password, done) {

    OutdoorsyUserModel.findOne({ email: username, password: password || 'fbConnect' }, function (err, user) {

        if (user) {
            return done(null, user);
        }

        return done(null, false, { message: 'Either the username or the password is incorrect. Please try again.' });
    });
}));

// serialize and deserialize functions
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

// login a user
app.post("/loginUsingEmail", passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});


// Configuring Mail Transport Server Details - SMTP
var smtpTransport = nodemailer.createTransport("SMTP", {
    service : "Gmail",
    auth : {
        user: "outdoorsyhuskies@gmail.com",
        pass: "msdproject"
    }
});

// Sign-Up New Users
app.post('/signUpUsingEmail', function (req, res) {
    var newUser = new OutdoorsyUserModel(req.body);

    newUser.save(function (err, userSaved) {
        if(userSaved.facebookId){
            res.json(userSaved);
        }
        else{
            var mailOptions = {
            to : userSaved.email,
            subject : "Outdoorsy Account Activation Required",
            html : "<p>Hello <b>" + userSaved.firstName  + "</b>, </p>" 
                     + "<p>Thanks for signing up to use Outdoorsy.</p><div>&nbsp;</div>"
                     + "<p>Please click the link to activate your account.</p>" 
                     + "<a href='" + appConfig.appConfig.mailServiceURL + userSaved._id + "'>Verify your account.</a><div>&nbsp;</div>"
                     + "<p>Thanks,</p>" + "<p><b>Outdoorsy Team.</b></p>"
            };

            smtpTransport.sendMail(mailOptions, function (err, response){
                if(err){
                    console.log(err);
                    res.send("error");
                }
                else{
                    res.json(userSaved);
                }
            });    
        }
    });
});

// check if user is logged in and maintain the session
app.get('/getUserInSession', function(req, res){
    res.send(req.isAuthenticated() ? req.user : '401 Unauthorized');
});


// log-out request by users
app.post('/logoutUser', function(req, res){
    req.logout();
    res.send('200 OK');
});

// get user by user id
app.get('/fetchUser/:userId', function (req, res){
    OutdoorsyUserModel.findById(req.params.userId, function (err, userFound){
        res.json(userFound);
    });
});

// get user by facebook id
app.get('/fetchFBUser/:facebookId', function (req, res){
    
    OutdoorsyUserModel.findOne({facebookId : req.params.facebookId}, function(err, userFound){
        res.json(userFound);
    });
});

// if fb user exists, we need to update the access token
app.put('/updateFacebookAccessToken/:facebookId', function(req, res){
    OutdoorsyUserModel.findOne({facebookId : req.params.facebookId}, function (err, userFound){
        
        userFound.facebookToken = req.body.accessToken;

        userFound.save(function (err, updatedUser){
            res.json(updatedUser);
        });
    });
});

// function to update user preferences
app.put('/updatePreferences/:userId', function (req, res){
    OutdoorsyUserModel.findById(req.params.userId, function (err, userFound){

        userFound.preferences = req.body.preferences;

        userFound.save(function (err, updatedUser){
            res.json(updatedUser);
        });
    });
});

// function to update user profile
app.put('/updateUserProfile/:userId', function (req, res) {
    OutdoorsyUserModel.findById(req.params.userId, function (err, userFound){

        userFound.firstName = req.body.firstName;
        userFound.lastName = req.body.lastName;
        userFound.email = req.body.email;
        
        if(req.body.password){
            userFound.password = req.body.password;        
        }

        userFound.accountActivated = req.body.accountActivated;

        userFound.save(function (err, updatedUser){
            res.json(updatedUser);
        });
    });
});

// function to delete user profile
app.delete('/deleteUser/:userId', function (req, res){
    // remove all userActivities first and then delete user
    UserActivitiesModel.remove({userId : req.params.userId}, function(err){
        if(err == null){
            OutdoorsyUserModel.remove({_id : req.params.userId}, function (err){
                if(err == null)
                    res.send('200 OK');
            });
        }
    });
    
});


// ----------------------- Categories And SubCategories From Eventbrite ---------------------- //
var CategoriesSchema = new mongoose.Schema({
    categoryId : String,
    categoryName : String,
    subCategories: [{
        subCategoryId : String,
        subCategoryName : String
    }]
}, {collection: 'categories'});

var CategoriesModel = mongoose.model("categories", CategoriesSchema);

// fetch all categories
app.get('/categories', function (req, res){
    CategoriesModel.find(function (err, allCategories){
        res.json(allCategories);
    });
});


// ------------------------------- User <-> Activity Relations Schema ------------------------------- //
var UserActivitiesSchema = new mongoose.Schema({
    userId : String,
    eventId : String,
    userRating : {
        isLiked : Boolean,
        isDisliked : Boolean
    },
    userReviews : [{
        commentedBy : String,    
        comment : String,
        commentDate : Number
    }]
}, {collection: 'useractivities'});

var UserActivitiesModel = mongoose.model("useractivities", UserActivitiesSchema);

// fetch activity by a user using userId and eventId
app.get('/getUserActivity/:userId/:eventId', function (req, res){

    UserActivitiesModel.findOne({userId : req.params.userId, eventId : req.params.eventId}, function (err, eventFound){
        res.json(eventFound);
    });
});

// add user activity
app.post('/addUserActivity', function (req, res){
    var activityToAdd = new UserActivitiesModel(req.body);

    activityToAdd.save(function (err, activitySaved){
        res.json(activitySaved);
    });
});

// update user activity
app.put('/updateUserActivity', function (req, res){

    UserActivitiesModel.findOne({userId : req.body.userId, eventId : req.body.eventId}, function (err, eventFound){
        eventFound.userRating = req.body.userRating;
        eventFound.userReviews = req.body.userReviews;

        eventFound.save(function (err, eventSaved){
            res.json(eventSaved);
        });
    });
});


// fetch all activities for an event
app.get('/fetchAllActivities/:eventId', function (req, res){
    UserActivitiesModel.find({eventId : req.params.eventId}, function (err, allActivities){
        res.json(allActivities);
    });
});

// fetch all liked events by a user
app.get('/fetchAllRatedEvents/:userId', function (req, res){
    UserActivitiesModel.find({userId : req.params.userId}, function (err, allRatedEvents){

        var eventsLiked = [];
        var eventsDisliked = [];

        for(var i in allRatedEvents){

            if(allRatedEvents[i].userRating){
                if(allRatedEvents[i].userRating.isLiked){
                    eventsLiked.push(allRatedEvents[i].eventId);
                }
                else if(allRatedEvents[i].userRating.isDisliked){
                    eventsDisliked. push(allRatedEvents[i].eventId);
                }    
            }
        }

        var ratedEvents = {
            eventsLiked : eventsLiked,
            eventsDisliked : eventsDisliked
        };

        res.json(ratedEvents);
    });
});

//---------------------- Setting Up Environment Variables ----------------------//
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress, function () {
console.log( "Listening on " + ipaddress + ", server_port " + port );
});