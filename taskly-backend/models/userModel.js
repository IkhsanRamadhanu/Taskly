const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [userData.username, userData.password], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },

  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }
};

module.exports = User;
