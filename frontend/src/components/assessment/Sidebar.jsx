import React from 'react'
import Timer from './Timer'

export default function Sidebar() {
  return (
    <div className="h-full w-1/5 bg-yellow-300 ">
      <div className='bg-blue-900 h-1/2'>dsd</div>
      <div className='bg-pink-700 h-1/2 flex flex-col gap-2 justify-center items-center pb-8'>
        <span>jk</span>
        <Timer />
      </div>
    </div>
  )
}
