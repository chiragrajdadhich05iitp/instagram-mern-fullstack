import React, { useState, useEffect } from 'react'
import API from './api'
import ChatModal from './ChatModal'
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Home, 
  Search, 
  Compass, 
  PlusSquare, 
  User as UserIcon, 
  LogOut, 
  MessageSquare,
  X,
  Grid,
  BookmarkCheck,
  Film,
  MoreHorizontal,
  Volume2
} from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('home') // 'home' | 'explore' | 'reels' | 'profile'
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [caption, setCaption] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')

  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedStory, setSelectedStory] = useState(null)
  const [selectedChatUser, setSelectedChatUser] = useState(null)
  const [commentInputs, setCommentInputs] = useState({})
  const [savedPostIds, setSavedPostIds] = useState([])
  const [profileViewTab, setProfileViewTab] = useState('posts')

  // Sample Stories Data
  const storiesList = [
    { username: 'chirag_tech', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600' },
    { username: 'react_dev', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600' },
    { username: 'alex_code', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600' },
    { username: 'sarah_ui', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600' },
    { username: 'mark_ai', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' }
  ]

  // Suggested Users
  const suggestedUsers = [
    { username: 'dev_community', subtitle: 'Followed by react_dev', pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { username: 'web3_coder', subtitle: 'Suggested for you', pic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
    { username: 'ui_patterns', subtitle: 'New to Instagram', pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }
  ]

  // Sample Reels Data
  const reelsList = [
    {
      id: 1,
      author: 'chirag_tech',
      caption: 'Late night architecture setups and cloud APIs 💻⚡',
      likes: '45.2K',
      comments: '1,208',
      videoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'
    },
    {
      id: 2,
      author: 'react_dev',
      caption: 'Fullstack vibes: Clean code meets fast UI 🚀',
      likes: '32.1K',
      comments: '890',
      videoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
    }
  ]

  const fetchFeed = async () => {
    try {
      const res = await API.get('/posts/all')
      setPosts(res.data.posts || [])
    } catch (err) {
      console.error('Failed to load feed', err)
    }
  }

  const demoLogin = async () => {
    try {
      const res = await API.post('/auth/login', {
        usernameOrEmail: 'chirag_tech',
        password: 'password123'
      })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
    } catch (err) {
      console.error('Login error', err)
    }
  }

  useEffect(() => {
    fetchFeed()
    demoLogin()
  }, [])

  const handleLike = async (postId) => {
    try {
      await API.put(`/posts/like/${postId}`)
      fetchFeed()
    } catch (err) {
      alert('Login required')
    }
  }

  const handleComment = async (postId) => {
    const text = commentInputs[postId]
    if (!text || !text.trim()) return
    try {
      await API.post(`/posts/comment/${postId}`, { text })
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }))
      fetchFeed()
    } catch (err) {
      alert('Failed to post comment')
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!mediaUrl.trim()) return
    try {
      await API.post('/posts/create', { caption, mediaUrl })
      setCaption('')
      setMediaUrl('')
      setShowCreateModal(false)
      fetchFeed()
      setActiveTab('home')
    } catch (err) {
      alert('Error creating post')
    }
  }

  const toggleSavePost = (id) => {
    setSavedPostIds((prev) => 
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    )
  }

  const myPosts = posts.filter((p) => p.author?.username === user?.username)
  const savedPostsList = posts.filter((p) => savedPostIds.includes(p._id))

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col justify-between hidden md:flex sticky top-0 h-screen select-none z-20 bg-black">
        <div className="space-y-8">
          <h1 
            onClick={() => setActiveTab('home')} 
            className="text-2xl font-bold tracking-wider italic cursor-pointer font-serif pl-2"
          >
            Instagram
          </h1>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`flex items-center gap-4 text-base w-full text-left p-3 rounded-xl transition ${activeTab === 'home' ? 'font-bold bg-zinc-900 text-white' : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-white'}`}
            >
              <Home size={24} /> Home
            </button>

            <button 
              onClick={() => setShowSearchModal(true)} 
              className="flex items-center gap-4 text-base w-full text-left p-3 rounded-xl hover:bg-zinc-900/60 text-zinc-400 hover:text-white transition"
            >
              <Search size={24} /> Search
            </button>

            <button 
              onClick={() => setActiveTab('explore')} 
              className={`flex items-center gap-4 text-base w-full text-left p-3 rounded-xl transition ${activeTab === 'explore' ? 'font-bold bg-zinc-900 text-white' : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-white'}`}
            >
              <Compass size={24} /> Explore
            </button>

            <button 
              onClick={() => setActiveTab('reels')} 
              className={`flex items-center gap-4 text-base w-full text-left p-3 rounded-xl transition ${activeTab === 'reels' ? 'font-bold bg-zinc-900 text-white' : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-white'}`}
            >
              <Film size={24} /> Reels
            </button>

            <button 
              onClick={() => setSelectedChatUser({ 
                _id: '670000000000000000000002', 
                username: 'react_dev', 
                profilePic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400' 
              })} 
              className="flex items-center gap-4 text-base w-full text-left p-3 rounded-xl hover:bg-zinc-900/60 text-zinc-400 hover:text-white transition"
            >
              <MessageSquare size={24} className="text-blue-500" /> Messages
            </button>

            <button 
              onClick={() => setShowCreateModal(true)} 
              className="flex items-center gap-4 text-base w-full text-left p-3 rounded-xl hover:bg-zinc-900/60 text-zinc-400 hover:text-white transition"
            >
              <PlusSquare size={24} /> Create
            </button>

            <button 
              onClick={() => setActiveTab('profile')} 
              className={`flex items-center gap-4 text-base w-full text-left p-3 rounded-xl transition ${activeTab === 'profile' ? 'font-bold bg-zinc-900 text-white' : 'hover:bg-zinc-900/60 text-zinc-400 hover:text-white'}`}
            >
              <UserIcon size={24} /> Profile
            </button>
          </nav>
        </div>

        {user && (
          <div className="flex items-center gap-3 border-t border-zinc-800 pt-4">
            <img src={user.profilePic} className="w-10 h-10 rounded-full object-cover border border-zinc-700" alt="avatar" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.username}</p>
              <p className="text-xs text-zinc-400 truncate">{user.fullName}</p>
            </div>
            <LogOut size={18} className="cursor-pointer text-zinc-500 hover:text-red-500 transition" />
          </div>
        )}
      </aside>

      {/* 2. MAIN CENTER CONTENT */}
      <main className="flex-1 flex justify-center py-6 px-4">
        
        {/* VIEW A: HOME FEED + SUGGESTIONS */}
        {activeTab === 'home' && (
          <div className="flex justify-center gap-12 w-full max-w-5xl">
            
            {/* Posts Stream */}
            <div className="w-full max-w-[480px]">
              {/* Stories Bar */}
              <div className="flex gap-4 overflow-x-auto pb-4 mb-6 border-b border-zinc-800/80 no-scrollbar">
                {storiesList.map((story, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedStory(story)}
                    className="flex flex-col items-center space-y-1.5 flex-shrink-0 cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 group-hover:scale-105 transition">
                      <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-zinc-800">
                        <img src={story.img} className="w-full h-full object-cover" alt="story" />
                      </div>
                    </div>
                    <span className="text-xs text-zinc-400 w-16 truncate text-center group-hover:text-white">{story.username}</span>
                  </div>
                ))}
              </div>

              {/* Feed Posts */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <article key={post._id} className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3.5 border-b border-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className="p-[1.5px] bg-gradient-to-tr from-yellow-400 to-pink-600 rounded-full">
                          <img
                            src={post.author?.profilePic || 'https://i.pravatar.cc/150'}
                            className="w-8 h-8 rounded-full object-cover border border-black"
                            alt="author"
                          />
                        </div>
                        <span className="font-semibold text-sm hover:underline cursor-pointer">{post.author?.username}</span>
                      </div>
                      <MoreHorizontal size={18} className="text-zinc-400 cursor-pointer hover:text-white" />
                    </div>

                    {/* Visual Media */}
                    <div 
                      onDoubleClick={() => handleLike(post._id)}
                      className="bg-black aspect-square overflow-hidden flex items-center justify-center cursor-pointer select-none"
                    >
                      <img src={post.mediaUrl} className="w-full h-full object-cover hover:scale-[1.01] transition duration-300" alt="post visual" />
                    </div>

                    {/* Actions */}
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between text-zinc-200">
                        <div className="flex items-center gap-4">
                          <Heart 
                            size={24} 
                            onClick={() => handleLike(post._id)}
                            className={`cursor-pointer transition active:scale-125 ${post.likes?.includes(user?.id) ? 'fill-red-500 text-red-500' : 'hover:text-zinc-400'}`} 
                          />
                          <MessageCircle size={24} className="cursor-pointer hover:text-zinc-400 active:scale-125 transition" />
                          <Send 
                            size={24} 
                            onClick={() => setSelectedChatUser(post.author)} 
                            className="cursor-pointer hover:text-blue-400 active:scale-125 transition" 
                          />
                        </div>
                        <Bookmark 
                          size={24} 
                          onClick={() => toggleSavePost(post._id)}
                          className={`cursor-pointer transition ${savedPostIds.includes(post._id) ? 'fill-white text-white' : 'hover:text-zinc-400'}`} 
                        />
                      </div>

                      <p className="font-bold text-sm">{post.likes?.length || 0} likes</p>

                      {post.caption && (
                        <p className="text-sm leading-snug">
                          <span className="font-semibold mr-2">{post.author?.username}</span>
                          {post.caption}
                        </p>
                      )}

                      {/* Comments Preview */}
                      {post.comments?.length > 0 && (
                        <div className="space-y-1 pt-1 max-h-24 overflow-y-auto">
                          {post.comments.map((c, idx) => (
                            <p key={idx} className="text-xs text-zinc-300">
                              <span className="font-semibold mr-1.5">{c.user?.username || 'user'}</span>
                              {c.text}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Row */}
                      <div className="flex items-center border-t border-zinc-900 pt-3 gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                          className="flex-1 bg-transparent text-sm focus:outline-none text-zinc-200 placeholder-zinc-500"
                        />
                        <button 
                          onClick={() => handleComment(post._id)}
                          className="text-blue-500 hover:text-blue-400 font-semibold text-xs transition"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Right Suggestions Column */}
            <aside className="w-72 hidden lg:block pt-4 space-y-6">
              {user && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.profilePic} className="w-12 h-12 rounded-full object-cover" alt="u" />
                    <div>
                      <p className="font-semibold text-sm">{user.username}</p>
                      <p className="text-xs text-zinc-400">{user.fullName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-500 hover:text-white cursor-pointer">Switch</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-400">
                  <span>Suggested for you</span>
                  <span className="text-white hover:underline cursor-pointer">See All</span>
                </div>

                <div className="space-y-3">
                  {suggestedUsers.map((su, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={su.pic} className="w-9 h-9 rounded-full object-cover" alt="suggested" />
                        <div>
                          <p className="text-xs font-semibold hover:underline cursor-pointer">{su.username}</p>
                          <p className="text-[11px] text-zinc-500">{su.subtitle}</p>
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-blue-500 hover:text-white transition">Follow</button>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="text-[11px] text-zinc-600 space-y-2 pt-4">
                <p>About · Help · Press · API · Jobs · Privacy · Terms</p>
                <p>© 2026 INSTAGRAM CLONE FROM META</p>
              </footer>
            </aside>
          </div>
        )}

        {/* VIEW B: REELS VIEW */}
        {activeTab === 'reels' && (
          <div className="w-full max-w-sm flex flex-col items-center gap-8 py-2">
            {reelsList.map((reel) => (
              <div key={reel.id} className="relative w-full h-[620px] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                <img src={reel.videoUrl} className="w-full h-full object-cover" alt="reel poster" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 flex flex-col justify-between p-5">
                  <div className="flex justify-end">
                    <Volume2 size={20} className="text-white bg-black/40 p-1 rounded-full cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" className="w-8 h-8 rounded-full border border-white" alt="author" />
                      <span className="font-bold text-sm">{reel.author}</span>
                      <button className="text-xs border border-white/60 px-3 py-1 rounded-lg font-semibold ml-2">Follow</button>
                    </div>
                    <p className="text-xs text-zinc-200">{reel.caption}</p>
                  </div>
                </div>

                {/* Vertical Reel Actions */}
                <div className="absolute right-3 bottom-12 flex flex-col items-center gap-5 text-white">
                  <div className="flex flex-col items-center cursor-pointer group">
                    <Heart size={26} className="group-hover:scale-110 group-hover:text-red-500 transition" />
                    <span className="text-xs mt-1 font-semibold">{reel.likes}</span>
                  </div>
                  <div className="flex flex-col items-center cursor-pointer group">
                    <MessageCircle size={26} className="group-hover:scale-110 transition" />
                    <span className="text-xs mt-1 font-semibold">{reel.comments}</span>
                  </div>
                  <Send size={24} className="cursor-pointer hover:text-blue-400 transition" />
                  <Bookmark size={24} className="cursor-pointer hover:text-zinc-400 transition" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW C: EXPLORE GRID */}
        {activeTab === 'explore' && (
          <div className="w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Compass size={24} className="text-blue-500" /> Explore Trending
            </h2>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {posts.concat(posts).map((item, i) => (
                <div key={i} className="relative group aspect-square bg-zinc-900 rounded-lg overflow-hidden cursor-pointer">
                  <img src={item.mediaUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="explore" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white font-semibold transition">
                    <span className="flex items-center gap-1.5"><Heart size={18} className="fill-white" /> {item.likes?.length || 0}</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={18} className="fill-white" /> {item.comments?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW D: USER PROFILE */}
        {activeTab === 'profile' && user && (
          <div className="w-full max-w-2xl space-y-8">
            <div className="flex items-center gap-8 border-b border-zinc-800 pb-8">
              <img src={user.profilePic} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-zinc-700" alt="profile" />
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold px-4 py-1.5 rounded-lg border border-zinc-700">
                    Edit profile
                  </button>
                </div>
                <div className="flex gap-6 text-sm">
                  <span><strong>{myPosts.length}</strong> posts</span>
                  <span><strong>842</strong> followers</span>
                  <span><strong>320</strong> following</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.fullName}</p>
                  <p className="text-xs text-zinc-400">Engineering & Distributed Cloud Systems 🚀</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center border-b border-zinc-800 gap-12 text-sm tracking-wider uppercase font-semibold text-zinc-500">
              <button 
                onClick={() => setProfileViewTab('posts')}
                className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition ${profileViewTab === 'posts' ? 'border-white text-white' : 'border-transparent'}`}
              >
                <Grid size={16} /> Posts
              </button>
              <button 
                onClick={() => setProfileViewTab('saved')}
                className={`flex items-center gap-2 py-3 border-t-2 -mt-[1px] transition ${profileViewTab === 'saved' ? 'border-white text-white' : 'border-transparent'}`}
              >
                <BookmarkCheck size={16} /> Saved
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {(profileViewTab === 'posts' ? myPosts : savedPostsList).map((post) => (
                <div key={post._id} className="relative group aspect-square bg-zinc-900 rounded-lg overflow-hidden">
                  <img src={post.mediaUrl} className="w-full h-full object-cover" alt="grid item" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 text-white font-semibold transition">
                    <span className="flex items-center gap-1"><Heart size={16} className="fill-white" /> {post.likes?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL: STORY VIEWER */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <button 
            onClick={() => setSelectedStory(null)} 
            className="absolute top-6 right-6 text-white hover:text-zinc-400"
          >
            <X size={28} />
          </button>
          <div className="relative w-full max-w-sm h-[600px] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Story Timer Bar */}
            <div className="w-full bg-zinc-700 h-1 rounded-full overflow-hidden">
              <div className="bg-white h-full animate-[ping_4s_ease-in-out_infinite] w-full" />
            </div>
            
            <div className="flex items-center gap-3">
              <img src={selectedStory.img} className="w-9 h-9 rounded-full object-cover border border-white" alt="avatar" />
              <span className="font-semibold text-sm">{selectedStory.username}</span>
              <span className="text-xs text-zinc-400">2h</span>
            </div>

            <img src={selectedStory.img} className="absolute inset-0 w-full h-full object-cover -z-10" alt="story visual" />

            <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl backdrop-blur-sm">
              <input 
                type="text" 
                placeholder={`Reply to ${selectedStory.username}...`} 
                className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-zinc-300"
              />
              <Heart size={20} className="cursor-pointer hover:text-red-500" />
              <Send size={20} className="cursor-pointer hover:text-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: CREATE POST */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 relative">
            <button 
              onClick={() => setShowCreateModal(false)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-center border-b border-zinc-800 pb-3 mb-4">Create New Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400">Media URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm mt-1 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Caption</label>
                <textarea
                  rows="3"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm mt-1 focus:outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 font-semibold py-2.5 rounded-lg text-sm transition"
              >
                Share Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: SEARCH USERS */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-5 relative">
            <button onClick={() => setShowSearchModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-base font-bold mb-4">Search Accounts</h3>
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none mb-4"
            />
            <div className="space-y-3">
              {[
                { username: 'chirag_tech', name: 'Chirag Raj', pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' },
                { username: 'react_dev', name: 'React Developer', pic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400' }
              ]
                .filter(u => u.username.includes(searchQuery.toLowerCase()))
                .map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setSelectedChatUser({ _id: '670000000000000000000002', ...item })
                      setShowSearchModal(false)
                    }} 
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
                  >
                    <img src={item.pic} className="w-10 h-10 rounded-full object-cover" alt="u" />
                    <div>
                      <p className="text-sm font-semibold">{item.username}</p>
                      <p className="text-xs text-zinc-400">{item.name}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: REAL-TIME DM CHAT */}
      {selectedChatUser && user && (
        <ChatModal 
          currentUser={user} 
          targetUser={selectedChatUser} 
          onClose={() => setSelectedChatUser(null)} 
        />
      )}
    </div>
  )
}