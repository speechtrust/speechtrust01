import React from 'react'
import { useState } from 'react'
import LoginCard from './LoginCard.jsx'
import GlowingBackground from '../commons/GlowingBackground'
import SignupCard from './SignupCard.jsx'
import Navbar from '../commons/Navbar.jsx'
import { Toaster } from 'sonner'

export default function AuthPage() {
const [mode, setMode] = useState("login");
  return (
     
      <>
        <Toaster position='top-left' />
        <Navbar mode={mode} setMode={setMode}/>
        <GlowingBackground>
  {mode === "login" ? <LoginCard /> : <SignupCard />}
       </GlowingBackground>
      </>
  )
}
  