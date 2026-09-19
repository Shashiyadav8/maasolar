const express = require('express');
const router = express.Router();
const { loginUser, createEmployee, getEmployees } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/employee', protect, admin, createEmployee);
router.get('/employees', protect, admin, getEmployees);

module.exports = router;
