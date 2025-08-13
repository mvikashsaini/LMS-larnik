import React from "react";

export default function CoursePage() {
    
    return (
    <>
        <div className="flex mx-auto w-full  h-full items-center justify-center mt-16 gap-5">


            <div className="w-[40%] h-48 bg-red-500 shadow-2xl rounded-2xl">
                <div className="flex flex-row gap-5">
                    <span>Programming</span>
                    <span>Beginner to Advanced</span>
                    <span>English</span>
                    
                </div>
                <h1 className="text-3xl lg:text-2xl font-bold mb-4 text-foreground">Complete Web Development Bootcamp</h1>
            </div>

            <div className="w-[20%] h-48 bg-red-500 shadow-2xl rounded-2xl">
                <div className="flex flex-row gap-5">
                    <span class="text-lg">$2999</span>
                    <span class="text-lg text-muted-foreground line-through">$5,999</span>
                    <span>50%off</span>
                </div>
                 <button className="bg-green-800 w-35 h-9">Enrolled</button>

            </div>

        </div>
    </>
    )
}