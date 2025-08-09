// src/pages/Home.jsx
import { ArrowRight, Award, BookOpen, Play, Star, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const HomePage = () => {

  return (
    <>
    <div id='main'>
      {/* for text area  */}
    <div className='text-black text-left pt-10 grid grid-cols-1 gap-8 bg-[#F3F8F4] mt-1 p-20 '>
      <h1 className='text-7xl font-bold'>Where You</h1>
      <h1 className='text-7xl font-bold text-green-700 '>Learn</h1>
      <h1 className='text-7xl font-bold'>With larnik</h1>
      <span>Experience the future of education with AI-powered <br />
       personalization, immersive content, and a global community of <br />
        passionate learners.</span>

        {/* button area  */}
        <div className='flex gap-5'>
        <button className='shadow border-black w-48 h-10 bg-green-800 rounded-xl text-white flex items-center justify-center gap-1'>Start Your Journey <ArrowRight size={20}/></button>
        <button className='shadow border-black w-48 h-10 bg-white rounded-xl text-black flex items-center justify-center gap-1'>Watch Preview <Play color='black' size={20} /></button>
        </div>
        
        {/* icon + text area  */}
        <div className='flex gap-20 '>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#2BCD7F] rounded-xl flex items-center justify-center">
            <BookOpen color="white" size={32} />
          </div>
            <span className="mt-2 text-center">hello</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#2898D4] rounded-xl flex items-center justify-center">
            <Users color="white" size={32} />
          </div>
            <span className="mt-2 text-center">hello</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#E862C0] rounded-xl flex items-center justify-center">
            <Award color="white" size={32} />
          </div>
            <span className="mt-2 text-center">hello</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#FB7D28] rounded-xl flex items-center justify-center">
            <Star color="white" size={32} />
          </div>
            <span className="mt-2 text-center">hello</span>
        </div>
      </div>
      
    </div>


    </div>
    </>
  );
};

export default HomePage;
