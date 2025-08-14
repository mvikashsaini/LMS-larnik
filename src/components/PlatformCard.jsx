import { Users } from "lucide-react";
import React from "react";

export default function PlatformCard({
    icon = Users,
    tittle = "Manage Users"
}) {
    
    const IconCopm = icon
    return (
        
        <>
        <div className="w-[98%] h-24 flex flex-col gap-3 shadow-xl rounded-2xl items-center justify-center bg-white hover:bg-green-400">
            <div>
                <IconCopm />
            </div>
            <div>
                <span className="font-bold text-xs">{tittle}</span>
            </div>
        </div>
        </>
    )
}