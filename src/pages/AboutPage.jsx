import { Stars, Users } from "lucide-react";
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

        <div className="flex gap-2 justify-center">
            {/* Card */}
            <div className="flex justify-center gap-6 mt-10">
                <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-xl w-64">
                    <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={32} color="blue" />
                    </div>
                    <p className="text-2xl font-bold text-green-700 mt-3">50k+</p>
                    <span className="text-sm text-black">Active Students</span>
                </div>
            </div>

        </div>
        </section>
        </>
    );
    
}