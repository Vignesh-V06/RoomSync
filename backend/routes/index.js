const express = require('express');

const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/profiles', require('./profileRoutes'));
router.use('/rooms', require('./roomRoutes'));

module.exports = router;
