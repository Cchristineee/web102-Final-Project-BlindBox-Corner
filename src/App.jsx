import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './index.css'
import HomeFeed from './pages/HomeFeed'
import CreatePost from './pages/CreatePost'
import Navbar from './Components/Navbar'
import EditPost from './pages/EditPages'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
