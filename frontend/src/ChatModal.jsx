import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { X, Send } from 'lucide-react'
import API from './api'

const socket = io('http://localhost:5000')

export default function ChatModal({ currentUser, targetUser, onClose }) {
  const [messages, setMessages] = useState([])
  const [inputMsg, setInputMsg] = useState('')

  useEffect(() => {
    if (currentUser?.id) {
      socket.emit('addUser', currentUser.id)
    }

    // Puraane messages load karo
    API.get(`/messages/${targetUser._id}`).then((res) => {
      setMessages(res.data)
    })

    // Real-time message receiver
    socket.on('receiveMessage', (data) => {
      if (data.sender === targetUser._id) {
        setMessages((prev) => [...prev, data])
      }
    })

    return () => socket.off('receiveMessage')
  }, [targetUser, currentUser])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputMsg.trim()) return

    const msgPayload = {
      receiverId: targetUser._id,
      message: inputMsg
    }

    const res = await API.post('/messages/send', msgPayload)

    // Socket se instant emit karo
    socket.emit('sendMessage', {
      senderId: currentUser.id,
      receiverId: targetUser._id,
      message: inputMsg
    })

    setMessages((prev) => [...prev, res.data])
    setInputMsg('')
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl flex flex-col h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img src={targetUser.profilePic} className="w-8 h-8 rounded-full object-cover" />
            <span className="font-semibold text-sm">{targetUser.username}</span>
          </div>
          <X className="cursor-pointer text-zinc-400 hover:text-white" onClick={onClose} />
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  m.sender === currentUser.id ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-200'
                }`}
              >
                {m.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-zinc-800 flex gap-2">
          <input
            type="text"
            placeholder="Message..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
          />
          <button type="submit" className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-500">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}