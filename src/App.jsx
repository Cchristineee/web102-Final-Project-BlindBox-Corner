import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import './index.css'
import HomeFeed from './pages/HomeFeed'
import CreatePost from './pages/CreatePost'
import Navbar from './Components/Navbar'
import EditPost from './pages/EditPages'
import PostDetail from './pages/PostDetail'
import Auth from './pages/Auth'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
