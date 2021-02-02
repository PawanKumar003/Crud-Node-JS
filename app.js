var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require("express-session");
const flash = require('connect-flash');
require('dotenv').config();

var app = express();

// Flash Message Initilize
app.use(flash());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var crudRouter = require('./routes/crud');
var waveitesRouter = require('./routes/waveites')

const { use } = require('./routes/index');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '2e45r67',
  resave: false,
  saveUninitialized: false
}));

// Dynamic Helpers for passing session in pug template
app.use( (req, res, next) => {   
  res.locals.session = req.session;
  res.locals.flash_success_msg = req.flash('success');
  res.locals.flash_error_msg = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/crud", crudRouter);
app.use("/waveites", waveitesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
