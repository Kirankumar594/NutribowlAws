const express = require('express');
const router = express.Router();
const adminController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', adminController.login);

// @route   GET /api/admin/me
// @desc    Get current admin
// @access  Private
router.get('/me', authMiddleware, adminController.getCurrentAdmin);

module.exports = router;