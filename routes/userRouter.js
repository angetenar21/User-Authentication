const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//regiuster routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

//login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

//dashboard route
router.get('/dashboard', authController.getDashboard);

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be logged in to change password.');
  res.redirect('/login');
};

router.get('/change-password', ensureAuthenticated, authController.getChangePassword);
router.post('/change-password', ensureAuthenticated, authController.postChangePassword);


//logout routes
router.get('/logout', authController.logout);

module.exports = router;