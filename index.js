const port = 3000;
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const userRouter = require('./routes/userRouter');
const layouts = require('express-ejs-layouts');
const passport = require('passport');
require('./config/passport');
const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(layouts);
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Middleware to set flash messages in response locals
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/authProj').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.use('/', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});