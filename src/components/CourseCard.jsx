import React, { useState } from "react";
const CourseCard = ({ course }) => {
    // variables 
    const [courseName, setCourseName] = useState('Complete React Development Bootcamp');
    const [author, setAuthor] = useState('by Sarah Johnson');
    const [price, setPrice] = useState(568);
    const [img, setImg] = useState('https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop');

    return (
     <>
     <div className="w-80 h-auto mx-auto m-10  bg-white rounded-2xl shadow-2xl">
        {/* course image  */}
      <img
        className="rounded-t-xl w-full h-48" src={img}/>
      <div className="mt-4 text-left pl-4 pb-5">
        <h2 className="text-lg font-bold text-gray-800">{courseName}</h2>
        {/* author name   */}
        <p className="text-gray-600 mt-2">
        {author}
        </p>
        <hr class="border-t border-gray-300 mt-5 w-72" />
        {/* price + button  */}
        <div className="flex mt-5 flex justify-between items-center w-64 pl-2">
        <h2 className="text-lg font-bold text-gray-800 text-center">${price}</h2>
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
  