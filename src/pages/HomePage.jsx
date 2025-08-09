// src/pages/Home.jsx
import { ArrowRight, Award, BookOpen, Play, Star, User, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const HomePage = () => {

  return (
    <>
    <div id="main" className="bg-[#F3F8F4] mt-1 p-20">
  <div className="grid grid-cols-2 gap-8 items-center">
    
    {/* LEFT SIDE - text area */}
    <div className="text-black text-left pt-10 space-y-6">
      <h1 className="text-7xl font-bold">Where You</h1>
      <h1 className="text-7xl font-bold text-green-700">Learn</h1>
      <h1 className="text-7xl font-bold">With larnik</h1>

      <span>
        Experience the future of education with AI-powered <br />
        personalization, immersive content, and a global community of <br />
        passionate learners.
      </span>

      {/* button area */}
      <div className="flex gap-5">
        <button className="shadow border-black w-48 h-10 bg-green-800 rounded-xl text-white flex items-center justify-center gap-1">
          Start Your Journey <ArrowRight size={20} />
        </button>
        <button className="shadow border-black w-48 h-10 bg-white rounded-xl text-black flex items-center justify-center gap-1">
          Watch Preview <Play color="black" size={20} />
        </button>
      </div>

      {/* icon + text area */}
      <div className="flex gap-10">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#2BCD7F] rounded-xl flex items-center justify-center">
            <BookOpen color="white" size={32} />
          </div>
          <h1 className="text-black font-bold text-2xl pt-1">50K+</h1>
          <span className="mt-2 text-center text-gray-500">Active Learners</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#2898D4] rounded-xl flex items-center justify-center">
            <Users color="white" size={32} />
          </div>
          <h1 className="text-black font-bold text-2xl pt-1">1.2k+</h1>
          <span className="mt-2 text-center text-gray-500">Expert Courses</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#E862C0] rounded-xl flex items-center justify-center">
            <Award color="white" size={32} />
          </div>
          <h1 className="text-black font-bold text-2xl pt-1">95%</h1>
          <span className="mt-2 text-center text-gray-500">Success Rate</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#FB7D28] rounded-xl flex items-center justify-center">
            <Star color="white" size={32} />
          </div>
          <h1 className="text-black font-bold text-2xl pt-1">4.9</h1>
          <span className="mt-2 text-center text-gray-500">Rating</span>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE - image */}
    <div className="relative w-[600px] h-[500px]">
  {/* Image */}
  <img
    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop&crop=center"
    alt="Sample"
    className="w-full h-full object-cover rounded-xl"
  />

  {/* Top rectangle glass block */}
  <div className="absolute -top-6 -left-6 backdrop-blur-lg bg-white/0 p-4 rounded-xl flex items-center gap-3 shadow-lg border border-white/50 shadow-xl">
    {/* Logo */}
    <div className="bg-green-600 w-10 h-10 flex items-center justify-center rounded-3xl">
          <BookOpen color="white" size={22} />
        </div>

        {/* Text */}
        <div>
          <p className="text-white font-semibold text-sm">Learn Anytime</p>
          <p className="text-white text-xs opacity-80">Access courses 24/7</p>
        </div>
  </div>

  {/* Bottom rectangle glass block */}
  <div className="absolute -bottom-6 right-6 backdrop-blur-lg bg-white/0 p-4 rounded-xl flex items-center gap-3 shadow-lg border border-white/20">
    {/* Intersecting Logos */}
    <div className="relative w-32 h-10">
      <div className="absolute left-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <User color="white" size={20} />
      </div>
      <div className="absolute left-8 w-10 h-10 bg-[#DF44BD] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <Users color="white" size={20} />
      </div>
      <div className="absolute left-16 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <Users color="white" size={20} />
      </div>
      <div className="absolute left-24 w-10 h-10 bg-[#DF44BD] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <Users color="white" size={20} />
      </div>
    </div>

    {/* Text */}
    <div>
      <h3 className="text-white font-bold text-sm">Learning Hub</h3>
      <p className="text-white text-xs opacity-80">Your path starts here</p>
    </div>
  </div>

</div>
  </div>
</div>

    </>
  );
};

export default HomePage;
