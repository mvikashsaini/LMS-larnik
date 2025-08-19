import { BookOpen, Clock, Star } from "lucide-react";
import React, { useState } from "react";
import CourseCard from "../components/Coursecard";
import { div } from "framer-motion/client";
import DiscountBar from "../components/DiscountBar";

export default function CoursePage() {
  const type = "image";
  const [activeTab, setActiveTab] = useState("overview");
   const reviews = [
    {
      name: "aman Kumar",
      avatar: "/d.jpg", 
      rating: 5,
      time: "2 weeks ago",
      review:
        "Excellent course! Very comprehensive and well-structured. The instructor explains everything clearly.",
    },
    {
      name: "kumar narendra",
      avatar: "/d.jpg", 
      rating: 5,
      time: "1 month ago",
      review:
        "Best web development course I've taken. Practical projects really help solidify the concepts.",
    },
  ];

  return (
    // <div className="container mx-auto px-4 py-8">
    
    //   <div className="flex flex-col lg:flex-row gap-5">
    //     <div className="lg:w-2/3 bg-white shadow-2xl rounded-2xl p-5">
    //       <div className="flex flex-wrap gap-3 text-sm mb-4">
    //         <span className="bg-gray-100 px-3 py-1 rounded-lg">Programming</span>
    //         <span className="bg-gray-100 px-3 py-1 rounded-lg">Beginner to Advanced</span>
    //         <span className="bg-gray-100 px-3 py-1 rounded-lg">English</span>
    //       </div>
    //       <h1 className="text-2xl font-bold mb-3">
    //         Complete Web Development Bootcamp
    //       </h1>
    //       <p className="text-gray-600 mb-4">
    //         Become a Full-Stack Developer with HTML, CSS, JavaScript, React, Node.js, and more!
    //       </p>

    //       <div className="flex items-center gap-3 text-sm">
    //         <div className="flex text-yellow-400">
    //           {Array.from({ length: 5 }).map((_, index) => (
    //             <Star key={index} />
    //           ))}
    //         </div>
    //         <span className="font-semibold">4.5</span>
    //         <Clock className="ml-4" /> <span>40 hours</span>
    //         <BookOpen className="ml-4" /> <span>156 lessons</span>
    //       </div>
    //     </div>
    //     <div className="lg:w-1/3 bg-white shadow-2xl rounded-2xl p-5 text-center">
    //       <div className="text-2xl font-bold">
    //         ₹2,999 <span className="text-gray-500 line-through text-lg">₹5,999</span>
    //       </div>
    //       <div className="text-green-600 font-semibold mb-4">50% Off</div>
    //       <button className="bg-green-800 text-white w-full py-2 rounded-lg mb-4">
    //         Enrolled
    //       </button>
    //       <ul className="text-left text-sm text-gray-600 space-y-1">
    //         <li>✔ 30-day money-back guarantee</li>
    //         <li>✔ Full lifetime access</li>
    //         <li>✔ Certificate of completion</li>
    //       </ul>
    //     </div>
    //   </div>

    //   <div className="flex flex-col lg:flex-row gap-5 mt-8">
    
    //     <div className="lg:w-2/3 bg-white shadow-2xl rounded-2xl p-3">
    //       {type === "image" ? (
    //         <img
    //           className="rounded-xl w-full object-cover h-96"
    //           src="/d.jpg"
    //           alt="Course Preview"
    //         />
    //       ) : (
    //         <video className="w-full rounded-xl" controls></video>
    //       )}
    //     </div>

    
    //     <div className="lg:w-1/3 space-y-5">
    //       <div className="bg-white shadow-2xl rounded-2xl p-5">
    //         <h2 className="text-lg font-bold mb-3">Course Statistics</h2>
    //         <p>Completion Rate: <span className="font-semibold">85%</span></p>
    //         <p>Student Satisfaction: <span className="font-semibold">98%</span></p>
    //         <p>Total Enrollments: <span className="font-semibold">2,847</span></p>
    //       </div>

    
    //       <div className="bg-white shadow-2xl rounded-2xl p-5">
    //         <h2 className="text-lg font-bold mb-3">Related Courses</h2>
    //         <div className="space-y-3">
    //           <div>
    //             <p className="font-semibold">React Masterclass</p>
    //             <p>₹1,999</p>
    //             <span>⭐ 4.8</span>
    //           </div>
    //           <div>
    //             <p className="font-semibold">Node.js Backend Development</p>
    //             <p>₹1,999</p>
    //             <span>⭐ 4.8</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="mt-8 border-b border-gray-300">
    //     <div className="flex gap-6 text-lg">
    //       {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
    //         <button
    //           key={tab}
    //           onClick={() => setActiveTab(tab)}
    //           className={`pb-2 ${
    //             activeTab === tab
    //               ? "border-b-2 border-green-800 font-semibold"
    //               : "text-gray-600"
    //           }`}
    //         >
    //           {tab.charAt(0).toUpperCase() + tab.slice(1)}
    //         </button>
    //       ))}
    //     </div>
    //   </div>

    //   <div className="mt-6">
    //     {activeTab === "overview" && (
    //       <div className="space-y-6">
    //         <div classname="bg-red-500">
    //           <h3 className="font-bold text-lg mb-2">What you'll learn</h3>
    //           <div className="list-disc pl-6 space-y-1">
    //             <li>Build responsive websites with HTML5 and CSS3</li>
    //             <li>Master JavaScript ES6+ and modern frameworks</li>
    //             <li>Create dynamic web apps with React.js</li>
    //             <li>Develop backend APIs with Node.js and Express</li>
    //             <li>Work with databases (MongoDB, SQL)</li>
    //             <li>Deploy applications to production</li>
    //             <li>Version control with Git and GitHub</li>
    //             <li>Best practices and industry standards</li>
    //           </div>
    //         </div>

    //         <div>
    //           <h3 className="font-bold text-lg mb-2">Requirements</h3>
    //           <ul className="list-disc pl-6 space-y-1">
    //             <li>Basic computer knowledge</li>
    //             <li>No programming experience required</li>
    //             <li>Computer with internet connection</li>
    //             <li>Willingness to learn and practice</li>
    //           </ul>
    //         </div>

    //         <div>
    //           <h3 className="font-bold text-lg mb-2">Description</h3>
    //           <p>
    //             Master web development from scratch with this comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Build real projects and get job-ready skills.
    //           </p>
    //         </div>
    //       </div>
    //     )}

    //     {activeTab === "curriculum" && (
    //       <div className="space-y-6">
    //         <div>
    //           <h3 className="font-bold text-lg mb-2">Getting Started</h3>
    //           <p>8 lessons • 2h 15m</p>
    //           <ul className="list-disc pl-6">
    //             <li>Course Introduction - 10:30</li>
    //             <li>Setting up Development Environment - 15:45</li>
    //             <li>HTML Basics - 25:20</li>
    //             <li>Practice Exercise - 30:00</li>
    //           </ul>
    //         </div>

    //         <div>
    //           <h3 className="font-bold text-lg mb-2">HTML & CSS Fundamentals</h3>
    //           <p>15 lessons • 5h 30m</p>
    //           <ul className="list-disc pl-6">
    //             <li>HTML Structure and Semantics - 20:15</li>
    //             <li>CSS Styling Basics - 18:30</li>
    //             <li>Responsive Design - 22:45</li>
    //           </ul>
    //         </div>

    //         <div>
    //           <h3 className="font-bold text-lg mb-2">JavaScript Programming</h3>
    //           <p>25 lessons • 8h 45m</p>
    //           <ul className="list-disc pl-6">
    //             <li>JavaScript Fundamentals - 35:20</li>
    //             <li>DOM Manipulation - 28:15</li>
    //           </ul>
    //         </div>
    //       </div>
    //     )}

    //     {activeTab === "instructor" &&
    //     (
    //         <div className="space-y-6">
    //             <div className="bg-white shadow rounded-2xl p-6 flex items-center space-x-6">

    //   <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 text-lg font-semibold text-gray-700">
    //     S
    //   </div>
    //    <div className="flex-1">
    //     <h2 className="text-xl font-bold">Sarah Johnson</h2>
    //     <p className="text-gray-500 mb-4">Senior Full-Stack Developer</p>

        
    //     <div className="flex flex-wrap gap-8 text-center">
    //       <div>
    //         <p className="text-green-600 font-bold text-lg">4.9</p>
    //         <p className="text-gray-500 text-sm">Rating</p>
    //       </div>
    //       <div>
    //         <p className="text-green-600 font-bold text-lg">45,000</p>
    //         <p className="text-gray-500 text-sm">Students</p>
    //       </div>
    //       <div>
    //         <p className="text-green-600 font-bold text-lg">8</p>
    //         <p className="text-gray-500 text-sm">Courses</p>
    //       </div>
    //       <div>
    //         <p className="text-green-600 font-bold text-lg">5+</p>
    //         <p className="text-gray-500 text-sm">Years</p>
    //       </div>
    //     </div>
    //     <p className="mt-4 text-gray-600 text-sm">
    //       Sarah is a seasoned full-stack developer with over 5 years of experience
    //       building web applications. She has worked with top tech companies and is
    //       passionate about teaching modern web development techniques.
    //     </p>
    //   </div>
    // </div>


    //         </div>
    //     )
    //      }

    //     {activeTab === "reviews" && (
    //          <div className="bg-white shadow rounded-2xl p-6">
      
    //   <div className="flex justify-between items-center mb-6">
    //     <h2 className="text-lg font-bold">Student Reviews</h2>
    //     <div className="flex items-center space-x-1">
    //       {Array.from({ length: 5 }).map((_, i) => (
    //         <Star key={i} className="text-yellow-400 w-5 h-5 fill-yellow-400" />
    //       ))}
    //       <span className="text-lg font-semibold ml-1">4.9</span>
    //     </div>
    //   </div>

    
    //   <div className="space-y-6">
    //     {reviews.map((review, idx) => (
    //       <div key={idx}>
    //         <div className="flex items-start space-x-4">
    //           <img
    //             src={review.avatar}
    //             alt={review.name}
    //             className="w-10 h-10 rounded-full object-cover"
    //           />
    //           <div className="flex-1">
    //             <div className="flex justify-between">
    //               <div>
    //                 <p className="font-semibold">{review.name}</p>
    //                 <div className="flex">
    //                   {Array.from({ length: review.rating }).map((_, i) => (
    //                     <Star
    //                       key={i}
    //                       className="text-yellow-400 w-4 h-4 fill-yellow-400"
    //                     />
    //                   ))}
    //                 </div>
    //               </div>
    //               <p className="text-gray-500 text-sm">{review.time}</p>
    //             </div>
    //             <p className="mt-2 text-gray-600 text-sm">{review.review}</p>
    //           </div>
    //         </div>

    
    //         {idx < reviews.length - 1 && (
    //           <hr className="mt-4 border-green-100" />
    //         )}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    //     )
        
    //     }
    //   </div>
    // </div>
    <>
    <DiscountBar />
    <div className="flex gap-6 flex-wrap">
    <CourseCard />
    <CourseCard />
    <CourseCard />
    <CourseCard />
    <CourseCard />
    <CourseCard />
    </div>
    <DiscountBar />
    </>
  );
}
