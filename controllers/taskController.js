const Task = require('../models/Task');

//get task form
exports.taskForm = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.render('taskForm', { tasks });
};

//create task
exports.createTask = async (req, res) => {
  await Task.create({
    user: req.user._id,
    title: req.body.title,
    description: req.body.description || '',
  });
  req.flash('success', 'Task created!');
  res.redirect('/addTask');
};

//get all tasks
exports.showTask = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.render('showTasks', { tasks });
};



//delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    req.flash('success', 'Task deleted successfully!');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
};

//update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in_progress', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: status },
      { new: true }
    );

    req.flash('success', 'Task status updated!');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
};