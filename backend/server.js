require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express()
app.use(cors())
app.use(express.json())

connectDB()

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/messages', messageRoutes)

// Socket.io Setup
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

let onlineUsers = new Map()

io.on('connection', (socket) => {
  socket.on('addUser', (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        sender: senderId,
        receiver: receiverId,
        message,
        createdAt: new Date()
      })
    }
  })

  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        break
      }
    }
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server + Socket running on port: ${PORT}`))