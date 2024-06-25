const express = require('express');
const router = express.Router();
const { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById); // Pastikan route ini ada
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.patch('/:id/status', authMiddleware, updateTaskStatus);

module.exports = router;
