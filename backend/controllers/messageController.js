const Message = require('../models/Message')

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body
    if (!message || !receiverId) {
      return res.status(400).json({ message: "Receiver and message are required" })
    }

    const newMessage = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      message
    })

    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.userId }
      ]
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { sendMessage, getMessages }