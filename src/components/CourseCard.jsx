import React from "react";
const CourseCard = ({ course }) => {
    return (
     <>
     <div className="w-80 h-auto mx-auto m-10  bg-white rounded-2xl">
        {/* course image  */}
      <img
        className="rounded-t-xl w-full h-48" src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop"/>
      <div className="mt-4 text-left pl-4 pb-5">
        <h2 className="text-lg font-bold text-gray-800">Complete React Development Bootcamp</h2>
        {/* author name   */}
        <p className="text-gray-600 mt-2">
        by Sarah Johnson
        </p>
        <hr class="border-t border-gray-300 mt-5 w-72" />
        {/* price + button  */}
        <div className="flex mt-5 flex justify-between items-center w-64 pl-2">
        <h2 className="text-lg font-bold text-gray-800 text-center">$567</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md">
          buy
        </button>
        </div>
      </div>
    </div>
     </>
    );
  };
  
  export default CourseCard;
  