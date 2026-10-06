require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')
const Post = require('./models/Post')
const connectDB = require('./config/db')

const seedData = async () => {
  try {
    await connectDB()

    await User.deleteMany({})
    await Post.deleteMany({})

    const hashedPassword = await bcrypt.hash('password123', 10)

    const user1 = await User.create({
      username: 'chirag_tech',
      email: 'chirag@example.com',
      password: hashedPassword,
      fullName: 'Chirag Raj',
      bio: 'Fullstack Systems & Aerospace',
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
    })

    const user2 = await User.create({
      username: 'react_dev',
      email: 'dev@example.com',
      password: hashedPassword,
      fullName: 'React Community',
      bio: 'Building modern web interfaces',
      profilePic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400'
    })

    await Post.create([
      {
        caption: 'First prototype deployed on MongoDB Atlas 🚀',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        author: user1._id,
        likes: [user2._id]
      },
      {
        caption: 'Late night coding vibes 💻',
        mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        author: user2._id,
        likes: [user1._id]
      }
    ])

    console.log('Database seeded with mock Instagram data successfully!')
    process.exit(0)
  } catch (err) {
    console.error(`Seeding error: ${err.message}`)
    process.exit(1)
  }
}

seedData()