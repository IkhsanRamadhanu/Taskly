const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.signup = (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  User.create({ username, password: hashedPassword }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid username or password' });

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  });
};

exports.getUser = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Failed to authenticate token', err);
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    User.findById(decoded.userId, (err, user) => {
      if (err) {
        console.log('Error finding user', err);
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ username: user.username });
    });
  });
};
