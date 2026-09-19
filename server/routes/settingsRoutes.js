const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, settingsController.getSettings);
router.put('/', protect, admin, settingsController.updateSettings);

module.exports = router;
