import React from "react";
import { BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white/40 shadow sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 shadow-xl">
        {/* Logo */}
        <div className="flex items-center space-x-2 ml-40">
          <div className="bg-green-700 text-white p-2 rounded-xl">
            <BookOpen size={20} />
          </div>
          <span className="font-bold text-xl text-gray-800">Larnik</span>
          <span className="font-medium text-sm text-gray-800 bg-green-100 px-2 py-0.5 rounded-2xl">
            LMS
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium ml-30">
          <a href="#courses" className="hover:text-green-600 ml-40">Courses</a>
          <a href="#about" className="hover:text-green-600">About</a>
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
        </nav>

        {/* Login/Signup */}
        <div className="hidden md:flex items-center space-x-3 text-green-800 ml-y">
          <button className="hover:text-green-600 ml-40">Login</button>
          <button className="hover:text-green-600">Sign Up</button>
        </div>
      </div>
    </header>
    
  );
}
