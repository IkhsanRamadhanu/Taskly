const Task = require('../models/taskModel');

exports.createTask = (req, res) => {
  const { title, description, due_date, link } = req.body;
  const userId = req.userId;
  const newTask = { title, description, due_date, link, user_id: userId, status: 'Not Completed' };

  Task.create(newTask, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Task created successfully' });
  });
};

exports.getTasks = (req, res) => {
  const userId = req.userId;

  Task.findByUserId(userId, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(tasks);
  });
};

exports.getTaskById = (req, res) => {
  const taskId = req.params.id;

  Task.findById(taskId, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    if (tasks.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(tasks[0]);
  });
};

exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const updatedData = req.body;

  Task.update(taskId, updatedData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Task updated successfully' });
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;

  Task.delete(taskId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Task deleted successfully' });
  });
};

exports.updateTaskStatus = (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  Task.updateStatus(taskId, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Task status updated successfully' });
  });
};
