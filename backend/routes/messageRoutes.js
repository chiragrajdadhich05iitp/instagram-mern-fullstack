const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')
const { sendMessage, getMessages } = require('../controllers/messageController')

router.post('/send', authMiddleware, sendMessage)
router.get('/:otherUserId', authMiddleware, getMessages)

module.exports = router