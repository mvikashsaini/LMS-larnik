import { TrendingUp, Users } from "lucide-react";
import React from "react";

export default function DashboardCard({
    title = "45,892",
    subtitle = "Total Users",
    data = "12",
    icon = Users ,
    colour = "blue"
}) {
    
    const IconComp = icon
    return (
        <>
        
            <div className="bg-white shadow-2xl rounded-xl w-[25%] h-32 flex flex-row justify-between p-5">
            
            
            <div className="flex flex-col items-start justify-center gap-0.5">
                <span className="text-2xl font-bold">{title}</span>
                <span className="text-sm font-semibold">{subtitle}</span>
                <span className="flex text-sm items-center gap-1 text-green-700"><TrendingUp size={16} color="green"/>+{data}%</span>
            </div>

            
            <div className={`flex items-center justify-center rounded-2xl bg-black/15 shadow-xl w-12 h-12`}>
                <IconComp color={colour}/>
            </div>
        </div>
        
        </>
    )
    
    
}