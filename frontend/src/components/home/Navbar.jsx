import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
     <div className="fixed flex justify-between top-0 left-0 w-full z-50 bg-transparent text-white px-8 py-4">
      <h1 className="text-xl font-bold">SpeechTrust</h1>
 <nav className="flex gap-8 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white shadow-lg">
  <a className="text-white hover:font-bold transition-all duration-300" href="/">Home</a>
  <a className="text-white hover:text-cyan-100 transition-all duration-300" href="/about">About</a>
  <a className="text-white hover:text-cyan-100 transition-all duration-300" href="/contact">Contact</a>
</nav>

    </div>
  )
}

export default Navbar
