const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { z } = require('zod')

const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1)
})

const signup = async (req, res) => {
  try {
    const parseResult = signupSchema.safeParse(req.body)
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid inputs", errors: parseResult.error.errors })
    }

    const { username, email, password, fullName } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(409).json({ message: "Username or email already in use" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName
    })

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body

    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePic: user.profilePic
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { signup, login }