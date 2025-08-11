import React from "react";

export default function CardDesign({
    // for all 
    variant = "course", 
    width = "w-[300px]",
    height = "h-[425px]",
    corner = "rounded-2xl", 
    bgColor = "bg-white",
    shadow = "shadow-2xl",
    // for image 
    // hsdvkjfhsakj
}) 
{


    switch (variant) {
        case "course":
            return (
                <div className={`${bgColor} ${width} ${height} ${corner} ${shadow} mx-auto flex flex-col items-center`}>
                        <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop" className="rounded-t-2xl"/>
                        <span>Complete React Devlopment Bootcamp</span>
                        <span>by Vikash Saini</span>
                        <hr class="border-t border-gray-300 mt-5 w-72" />
                        <div>
                            <span>$9999</span>
                            <button>Buy</button>
                        </div>
                </div>

        
            );

        default:
            return null;
    }

}
