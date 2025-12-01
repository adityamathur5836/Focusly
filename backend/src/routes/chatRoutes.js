const express = require('express');
const router = express.Router();
const {
    startChatSession,
    sendMessage,
    getChatSession,
    getAllChatSessions,
    deleteChatSession
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startChatSession);
router.post('/:id/message', protect, sendMessage);
router.get('/:id', protect, getChatSession);
router.get('/', protect, getAllChatSessions);
router.delete('/:id', protect, deleteChatSession);

module.exports = router;
