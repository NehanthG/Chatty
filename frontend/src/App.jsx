import React from 'react'
import Navbar from './components/Navbar'
import {Routes, Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import {Loader} from "lucide-react" 
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
export default function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers,connectSocket}=useAuthStore()
  const {theme}=useThemeStore()

  console.log({onlineUsers});
  
  useEffect(() => {
    checkAuth()
  },[checkAuth])

  useEffect(() => {
    connectSocket()
  },[authUser,connectSocket])

// isCheckingAuth && !authUser
  if(isCheckingAuth && !authUser){
    return <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  }
  return (
    <div data-theme={theme} >
      <Navbar/>

      <Routes>
        <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/"/>}/>
        <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/> }/>
      </Routes>
      <Toaster/>
    </div>

  )
}
