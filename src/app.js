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
var AdminRouter = require('./routes/admin');
var CheckoutRouter = require('./routes/checkout');

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

app.use(express.static(path.resolve() + '/src/public'));

app.use('/', HomeRouter);
app.use('/games', GamesRouter);
app.use('/', UsersRouter);
app.use('/customer', ProfilesRouter);
app.use('/admin', AdminRouter);
app.use('/checkout', CheckoutRouter);

module.exports = app;

