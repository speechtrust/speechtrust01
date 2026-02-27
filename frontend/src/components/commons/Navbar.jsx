import React from 'react'

export default function Navbar({ mode, setMode }) {
  return (
        <div className='absolute h-12 bg-blue-950 z-30 top-5 right-5 rounded-2xl justify-center items-center flex p-2'>
            <span className='text-white px-3 items-center flex justify-center text-md cursor-pointer font-medium hover:text-blue-400'>
              Home
            </span>
            <span className='text-white px-3 items-center flex justify-center text-md cursor-pointer font-medium hover:text-blue-400'>
              About
            </span>
            <span 
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className='text-white px-3 items-center flex justify-center text-md cursor-pointer font-medium hover:text-blue-400'>
              {mode === "login" ? "Signup" : "Login"}
            </span>
        </div>
  )
}
