import React from 'react';
import { Button } from '../ui/button';

export default function TopBar() {
  return (
    <div className="w-full bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-3">
        {/* <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div> */}
        <span className="text-slate-800 font-semibold text-lg tracking-tight">
           Technical Assessment              {/* Assessment name */}
        </span>
      </div>
      <Button variant="outline" className="border-slate-300! text-slate-700! hover:bg-slate-200! bg-transparent!">
        Finish Assessment
      </Button>
    </div>
  );
}