import { useState } from 'react'
import ViewPosts from './components/ViewPosts'
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import AddPostForm from './components/AddPostForm';
import ViewSinglePost from './components/ViewSinglePost';
import './App.css'

function App() {
  

  return (
    <>
    
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/posts" element={<AddPostForm/>}></Route>
      <Route path="/posts/:id" element={<ViewSinglePost/>}></Route>
    </Routes>
    </>
  )
}

export default App
