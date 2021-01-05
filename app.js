const httpError = require('http-errors'),
      cors = require('cors'),
      express = require('express'),
      sassMiddleware = require('node-sass-middleware'),
      path = require('path'),
      nunjucks = require('nunjucks'),
      cookieParser = require('cookie-parser');
      morgan = require('morgan');

constants = {};
constants.appRoot = require('app-root-path');

// routes
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');

let app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// configure middlewares
app.use(sassMiddleware({
  src: path.join(__dirname, 'bootstrap'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload_image', uploadRouter);


app.use(function(req, res, next) {
  next(httpError(404));
});

app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;