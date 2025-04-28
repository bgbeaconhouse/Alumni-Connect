import { useState } from 'react'
import ViewPosts from './components/ViewPosts'
import {Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import AddPostForm from './components/AddPostForm';
import ViewSinglePost from './components/ViewSinglePost';
import './App.css'
import ViewOwnProfile from './components/ViewOwnProfile';
import ViewProfiles from './components/ViewProfiles';
import ViewComments from './components/ViewComments';

function App() {
  

  return (
    <>
    
    
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/posts" element={<AddPostForm/>}></Route>
      <Route path="/posts/:id" element={<ViewSinglePost/>}></Route>
      <Route path="/profiles/" element={<ViewProfiles/>}/>
      <Route path="/profiles/:id" element={<ViewOwnProfile />}/>
      <Route path="/posts/:id/comments" element={<ViewComments/>}></Route>

    </Routes>
    
    </>
  )
}

export default App
