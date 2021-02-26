var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var HomeRouter = require('./routes/home');
var GamesRouter = require('./routes/games');

let app = express();

app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.set('views', path.resolve() + '/src/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve() + '/src/public'));

app.use('/', HomeRouter);
app.use('/games', GamesRouter);

module.exports = app;
