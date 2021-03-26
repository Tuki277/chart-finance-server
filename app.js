var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const socketio = require('socket.io');
const http = require('http').createServer(app);
const io = socketio(3003)

app.io = io

io.on('connection', socket => {
  console.log('connect react')

  var title = Math.floor(Math.random() * 1000) + 1

  socket.emit('data', title)

  socket.on('message', data => {
    console.log(data.message)
    if ( data.message === 'sent') {
      setTimeout(function() {
        var title = Math.floor(Math.random() * 100) + 1
        socket.emit('data', title)
      }, 3500);
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnect react')
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
