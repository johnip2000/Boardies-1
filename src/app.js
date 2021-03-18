var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var HomeRouter = require('./routes/home');
var GamesRouter = require('./routes/games');
var UsersRouter = require('./routes/users');
var ProfilesRouter = require('./routes/profiles');
const ProfileController = require('./controllers/profiles');

let app = express();

app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.set('views', path.resolve() + '/src/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
      
//passport 
const passport = require('passport');
var userProfile;


app.use(passport.initialize());
app.use(passport.session());



app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '901612188519-lk6kqv8leo89uiqg3rd91rn88afdej8n.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'V2PTwCZwVTU8GH9g7C4-FnwN';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:7000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
     

  }
));


app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    console.log(userProfile)
    console.log(`name = ${userProfile.displayName}`)
    console.log(`emails = ${userProfile.emails[0].value}`)
    //you will get this
    
    
  
    res.redirect('/success');
   // console.log(pool)
   
  });
//********//
app.use(express.static(path.resolve() + '/src/public'));

app.use('/', HomeRouter);
app.use('/games', GamesRouter);
app.use('/', UsersRouter);
app.use('/customer', ProfilesRouter);

module.exports = app;
