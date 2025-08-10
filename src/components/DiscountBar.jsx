import React from "react";

export default function DiscountBar() {
    const DiscountAmount = ('50%')
    const DiscountCoupon = ('LEARN50')
    
    return (
        <>
        <div className="h-24 bg-rose-200 flex items-center justify-center">
            <h1 className="text-2xl text-black font-semibold">Use code <span className="bg-yellow-200 px-2 py-0.5 rounded-lg">{DiscountCoupon}</span> to get {DiscountAmount} off on your first month!</h1>
        </div>
        </>
    );
    
}