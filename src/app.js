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
app.use(express.static(path.resolve() + '/src/public'));

app.use('/', HomeRouter);
app.use('/games', GamesRouter);
app.use('/', UsersRouter);
app.use('/customer', ProfilesRouter);

module.exports = app;
