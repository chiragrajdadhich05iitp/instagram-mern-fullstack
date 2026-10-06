const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')
const {
  createPost,
  getAllPosts,
  toggleLike,
  addComment
} = require('../controllers/postController')

// Public: Feed view
router.get('/all', getAllPosts)

// Protected routes (JWT required)
router.post('/create', authMiddleware, createPost)
router.put('/like/:id', authMiddleware, toggleLike)
router.post('/comment/:id', authMiddleware, addComment)

module.exports = router