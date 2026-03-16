import React from 'react'
import { Button } from '../ui/button'

export default function TopBar() {
  return (
    <div className="w-full bg-amber-700 h-15 p-4 gap-2 flex justify-between">
        <span className='text-white font-bold text-xl'>Assessement Name</span>
        <Button>Finish</Button>
    </div>
  )
}
