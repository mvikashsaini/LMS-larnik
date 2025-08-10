import { Award, BookOpen, Brain, Globe, Rocket, Stars, Trophy, Users } from "lucide-react";
import React from "react";

export default function AboutPage() {
    return (
        <>
        <section className="bg-gray-50 py-16 px-16">
            {/* top text icon  */}
        <div className="bg-lime-100 w-64 mx-auto pt-1 pb-1 rounded-full shadow-xl">
            <div className="text-green-700 flex justify-center text-xs gap-1">
                <Stars color="green" size={16}/>
                <span>Transforming Education Since 2020</span>
            </div>
        </div>

        {/* large text  */}
        <div>
            <div className="flex gap-2 justify-center mt-5 ">
                <h1 className="font-bold text-6xl text-black">About</h1>
                <h1 className="font-bold text-6xl text-green-700">Larnik</h1>
            </div>
        </div>

        {/* small text  */}
        <div className="mt-5">
            <span className="text-black">We're on a mission to democratize quality education and empower learners worldwide <br /> through innovative technology and exceptional teaching.</span>
        </div>

        {/* Cards */}
        <div className="flex gap-2 justify-center">
            {/* Card */}
            <div className="flex justify-center gap-6 mt-10">
                <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl w-64">
                    <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={32} color="blue" />
                    </div>
                    <p className="text-2xl font-bold text-black mt-3">50k+</p>
                    <span className="text-sm text-black">Active Students</span>
                </div>
            </div>
            {/* Card */}
            <div className="flex justify-center gap-6 mt-10">
                <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl w-64">
                    <div className="bg-green-100 p-3 rounded-full">
                    <BookOpen size={32} color="green" />
                    </div>
                    <p className="text-2xl font-bold text-black mt-3">1000+</p>
                    <span className="text-sm text-black">Courses Available</span>
                </div>
            </div>
            {/* Card */}
            <div className="flex justify-center gap-6 mt-10">
                <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl w-64">
                    <div className="bg-purple-100 p-3 rounded-full">
                    <Award size={32} color="purple" />
                    </div>
                    <p className="text-2xl font-bold text-black mt-3">500+</p>
                    <span className="text-sm text-black">Expert Instructors</span>
                </div>
            </div>
            {/* Card */}
            <div className="flex justify-center gap-6 mt-10">
                <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl w-64">
                    <div className="bg-orange-100 p-3 rounded-full">
                    <Globe size={32} color="orange" />
                    </div>
                    <p className="text-2xl font-bold text-black mt-3">150+</p>
                    <span className="text-sm text-black">Countries Served</span>
                </div>
            </div>
        </div>

        
        </section>

        <section className=" bg-slate-300 py-16 px-16">
        <div className="mt-20 grid grid-cols-2 gap-8 items-center">
           {/* left side  */}
            <div>
                {/* brain icon + text  */}
                <div className="w-32 bg-blue-100 flex items-center gap-2 justify-center p-1 rounded-full shadow-sm">
                    <Brain color="blue" size={18} />
                    <span className="text-blue-800 font-medium">Our Story</span>
                </div>

                {/* text area  */}
                <div className="mt-5">
                    <h1 className="text-black font-bold text-3xl text-left">Reimagining Education for the Digital Age</h1>
                    <p className="text-gray-500 text-left text-sm/6 pt-4 flex gap-5">Founded in 2020 by a team of passionate educators and technologists,
                         Larnik emerged from a simple observation: traditional education wasn't keeping pace with the rapidly evolving world. <br  /><br />
                        We believed that learning should be accessible, engaging, and tailored to individual needs. 
                        This vision drove us to create a platform that combines cutting-edge technology with proven pedagogical principles. <br /><br />
                        Today, we're proud to serve over 50,000 students across 150+ countries, offering world-class education that adapts to each learner's unique journey.</p>
                </div>

                {/* button area  */}
                <div className="flex gap-3  pt-14">
                    <button className=" shadow-2xl rounded-lg w-36 bg-green-500 text-sm flex gap-1 items-center justify-center "><Rocket color="white" size={16}/>Join Our Mission</button>
                    <button className="pt-1 pb-1 shadow-lg rounded-xl w-32 bg-white text-black text-sm">Read Our Blog</button>
                </div>
            </div>

            {/* right side  */}
            <div className="relative w-fit">
                <img className="object-cover rounded-xl w-[600px] h-[300px]"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"/>

                {/* Glass container */}
                <div className="flex gap-4 absolute -bottom-6 -right-6 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg w-64">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center"><Trophy color="white"/></div>
                    <div><h3 className="text-left text-lg font-semibold text-white">98% Success</h3>
                    <p className="text-sm text-left  text-white/80">Rate Student Satisfaction</p></div>
                </div>
            </div>

        </div>
        </section>
        </>
    );
    
}