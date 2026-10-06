const Post = require('../models/Post')
const User = require('../models/User')

// 1. Create Post
const createPost = async (req, res) => {
  try {
    const { caption, mediaUrl } = req.body

    if (!mediaUrl) {
      return res.status(400).json({ message: "Media URL is required" })
    }

    const post = await Post.create({
      caption,
      mediaUrl,
      author: req.userId
    })

    const populatedPost = await post.populate('author', 'username fullName profilePic')
    res.status(201).json({ message: "Post created successfully", post: populatedPost })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// 2. Get All Posts (Feed)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username fullName profilePic')
      .populate('comments.user', 'username profilePic')
      .sort({ createdAt: -1 })

    res.status(200).json({ posts })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// 3. Like / Unlike Post
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const isLiked = post.likes.includes(req.userId)

    if (isLiked) {
      post.likes = post.likes.filter((userId) => userId.toString() !== req.userId.toString())
    } else {
      post.likes.push(req.userId)
    }

    await post.save()
    res.status(200).json({ message: isLiked ? "Post unliked" : "Post liked", likesCount: post.likes.length })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// 4. Add Comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    post.comments.push({
      user: req.userId,
      text: text.trim()
    })

    await post.save()

    const updatedPost = await Post.findById(id)
      .populate('author', 'username fullName profilePic')
      .populate('comments.user', 'username profilePic')

    res.status(201).json({ message: "Comment added", comments: updatedPost.comments })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { createPost, getAllPosts, toggleLike, addComment }