import React from "react";

export default function AlertCard({
    
      title= "High Server Load",
      btn_name = "Warning",
      subtitle = "Server CPU is at 85%",
      data = "5 minutes",
      bgcolour= "yellow",
      ntmcolour= "yellow"
    }) {

    return (
        <>
        <div className={`w-full h-28 bg-white rounded-xl border border-yellow-700 flex flex-col shadow-2xl`}>
            <div className="flex gap-9 p-2">
                <span className="text-sm font-bold">{title}</span>
                <span className="bg-green-200 py-0.5 px-2 rounded-xl text-xs">{btn_name}</span>
            </div>
            <div className="flex flex-col items-start px-3 gap-5">
                <span className="text-sm">{subtitle}</span>
                <span className="text-xs">{data}</span>
            </div>
        </div>
        </>
    )
    
}