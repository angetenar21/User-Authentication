const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be logged in to change password.');
  res.redirect('/login');
};

//get task form (shows form + all tasks)
router.get('/addTask', ensureAuthenticated, taskController.taskForm);

//post task form
router.post('/addTask', ensureAuthenticated, taskController.createTask);

//delete a task
router.delete('/task/:id', ensureAuthenticated, taskController.deleteTask);

//update task status
router.patch('/task/:id/status', ensureAuthenticated, taskController.updateTaskStatus);

module.exports = router;