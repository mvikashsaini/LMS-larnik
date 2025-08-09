import { Award, BookOpen, Brain, Globe, Stars, Users } from "lucide-react";
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

        <div className="pt-20">
            <div>
                {/* brain icon + text  */}
                <div className="w-32 bg-blue-100 flex items-center gap-2 justify-center p-1 rounded-full shadow-sm">
                    <Brain color="blue" size={18} />
                    <span className="text-blue-800 font-medium">Our Story</span>
                </div>

                {/* text area  */}
                <div>
                    <h1 className="text-black font-bold text-3xl">Reimagining Education for the Digital Age</h1>
                    <span className="text-black">Founded in 2020 by a team of passionate educators and technologists, Larnik emerged from a simple observation: traditional education wasn't keeping pace with the rapidly evolving world.
We believed that learning should be accessible, engaging, and tailored to individual needs. This vision drove us to create a platform that combines cutting-edge technology with proven pedagogical principles.
Today, we're proud to serve over 50,000 students across 150+ countries, offering world-class education that adapts to each learner's unique journey.</span>
                </div>
            </div>
        </div>
        </section>
        </>
    );
    
}