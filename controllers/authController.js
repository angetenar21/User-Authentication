const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

//get register page
exports.getRegister = (req, res) => {
  res.render('register', { title: 'Register' });
}

// Handle user registration
exports.postRegister = async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  try {
    let userPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: userPassword
    });
    await user.save();
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
}

//get login page
exports.getLogin = (req, res) => {
  res.render('login', { title: 'Login' });
}

// Handle user login
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error', info ? info.message : 'Login failed');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', 'Login successful!');
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};


//dashboard route
exports.getDashboard = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  // Render the dashboard view if authenticated
  res.render('dashboard', { user: req.user.username });
}

//render change password page
exports.getChangePassword = (req, res) => {
  res.render('change-password', { title: 'Change Password' });
};

// Handle password change request
exports.postChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/change-password');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/change-password');
    }

    if (newPassword.length < 6) {
      req.flash('error', 'New password must be at least 6 characters.');
      return res.redirect('/change-password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    req.flash('success', 'Password changed successfully.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error changing password:', error);
    req.flash('error', 'Something went wrong.');
    res.redirect('/change-password');
  }
};

// Handle user logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/login'); // Redirect to login after logout
  });
}