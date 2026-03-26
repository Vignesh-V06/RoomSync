const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId', authMiddleware, profileController.getProfile);
router.post('/', authMiddleware, profileController.upsertProfile);

module.exports = router;
