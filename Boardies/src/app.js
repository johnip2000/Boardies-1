import path from 'path';
import express from 'express';
import session from 'express-session';
import mssql from 'mssql/msnodesqlv8';
import HomeRouter from './routes/home';
import bodyParser from 'body-parser';
import methodOverride from "method-override";

let app = express();

var config = {
  database:'Boardies',
  server: 'localhost',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    enableArithAbort: true
  }
};

// connect to database
await mssql.connect(config, function (err) {
  if(err){
    console.log(err)
  }else {
    console.log('DB Connected');
  }
});

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

export default app;
