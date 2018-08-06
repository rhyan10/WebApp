var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cron = require('node-cron');
var cmd = require('node-cmd');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var leaderRouter = require('./routes/LeaderBoard');
var dbrouter = require('./routes/AddResults');
var onload = require('./routes/Onload');
var index = require('./routes/index');
var path = require('path');
//var index = require('./routes/Index.html');
var router = express.Router();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/leader', leaderRouter);
app.use('/UpdateDB',dbrouter);
app.use('/onload',onload);
app.use('/',index);
app.use(function(req, res, next) {
  next(createError(404));
});
require('./db');
// error handler
cron.schedule('*/10 * * * *', function(){
    cmd.run('node public/javascripts/Punishment.js');
    console.log('Punishment.js has been executed');
});
cron.schedule('*/40 * * * *', function(){
    cmd.run('node public/javascripts/CheckAgainstParser.js');
    console.log('CheckAgainstParser.js has been executed');
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;

