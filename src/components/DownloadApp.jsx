import React from "react";

export default function DownloadApp() {
    return (
        <>
        <div className="h-64 bg-green-600 flex flex-col items-center justify-center gap-1">
            <h1 className="text-2xl text-white font-bold">Learn Anytime, Anywhere</h1>
            <span className="pt-1 font-semibold">Download our mobile app for on-the-go learning</span>
            <div className="bg-white rounded-lg  flex justify-center items-center shadow-xl mt-2">
                <a href="*"><button className="text-green-800 w-40 h-9 font-bold pb-8">Download App</button></a>
            </div>
        </div>
        </>
    );
    
}