const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// Rooms
router.post('/', authMiddleware, roomController.createRoom);
router.get('/vacant/:userId', authMiddleware, roomController.getVacantRooms);

// Requests
router.post('/apply', authMiddleware, requestController.applyRoom);
router.get('/requests/:ownerId', authMiddleware, requestController.getOwnerRequests);
router.post('/requests/accept', authMiddleware, requestController.acceptRequest);
router.post('/requests/reject', authMiddleware, requestController.rejectRequest);

module.exports = router;
