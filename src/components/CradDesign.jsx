import { Target } from "lucide-react";
import React from "react";

export default function CardDesign({
    // for all 
    variant = "subscribe", 
    width = "w-[260px]",
    height = "h-[300px]",
    corner = "rounded-2xl", 
    bgColor = "bg-white",
    iconbgColor = "bg-green-700",
    shadow = "shadow-2xl",
    img = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    icon =  Target,
    title = "Mission Driven",
    subsTitle = "Basic",
    btnName = "Enroll",
    price = "$9999999",
    description = "Democratizing quality education and making learning accessible to everyone, everywhere.",
    // for image 
}) 
{
const Iconcomponent = icon;
            return (
                <div>
                    
                    <div className={`${bgColor} ${width} ${height} ${corner} ${shadow} mx-auto flex flex-col items-start bg-red-500`}>
                       {variant === "course" ? 
                       (
                        <>
                            <img src={img} className="rounded-t-2xl"/>
                            <span className="text-black font-bold text-xl text-left p-3">{title}</span>
                            <span className="text-gray-500 font-semibold text-center p-3">{description}</span>
                            <hr className="border-t border-gray-300 mt-5 w-72" />
                            <div className="w-[80%] mt-4 flex justify-between items-center mx-auto">
                            <span className="text-green-800 font-bold text-xl">₹{price}</span>
                            <button className="px-1 py-0.5 shadow-2xl bg-green-400">{btnName}</button>
                            </div>
                        </>
                        ) : variant === "subscribe" ?
                        (
                            <>
                            <div className="flex flex-col items-center justify-center w-full gap-3 h-full">
                                <span className="text-2xl font-bold">{subsTitle}</span>
                                <span className="text-green-800  text-3xl font-bold">₹{title}</span>
                                <span className="">{description}</span>
                                <span className="text-green-700">7 days Free Trial <br /> 15 Days Money BAck Guarantee</span>
                                <button className="text-white bg-green-800 w-[50%]">{btnName}</button>
                            </div> 
                            </>
                        ) : variant === "values" ?
                        (
                            <>
                            <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                                <Iconcomponent color="white" size={40} className={`${iconbgColor} w-16 h-16 rounded-xl p-2`}/>
                                <span className="text-xl font-bold text-black">{title}</span>
                                <span className="text-black text-center">{description}</span>
                            </div>
                            </>
                        ) : variant === "profile" ?
                        (
                            <>
                             <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                                <img className="w-24 h-24 rounded-full" src={img}/>
                                <span className="text-black font-bold text-xl">{title}</span>
                                <span className="text-xs font-thin bg-green-100 py-0.5 px-2 rounded-full">{subsTitle}</span>
                                <span className="text-xs p-2">{description}</span>
                                <button className="border-black py-0.5 px-1 text-sm">{btnName}</button>
                            </div>
                            </>
                        ) : ("")
                    }
                </div>
                </div>

        
            );
}
