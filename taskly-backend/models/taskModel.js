const db = require('../config/db');

const Task = {
  create: (taskData, callback) => {
    const query = 'INSERT INTO tasks (title, description, due_date, status, link, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [taskData.title, taskData.description, taskData.due_date, taskData.status, taskData.link, taskData.user_id], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },

  findById: (taskId, callback) => {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    db.query(query, [taskId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  findByUserId: (userId, callback) => {
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  update: (taskId, updatedData, callback) => {
    const query = 'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ?, link = ? WHERE id = ?';
    db.query(query, [updatedData.title, updatedData.description, updatedData.due_date, updatedData.status, updatedData.link, taskId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },

  delete: (taskId, callback) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [taskId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },

  updateStatus: (taskId, status, callback) => {
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    db.query(query, [status, taskId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
};

module.exports = Task;
