var path = require('path');
var express = require('express');
var session = require('express-session');
var HomeRouter = require('./routes/home');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

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

module.exports = app;
