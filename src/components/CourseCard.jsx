import React, { useState } from "react";
import CardDesign from "./CradDesign";

export default function CourseCard({ course }) {
  // States
  const [courseName, setCourseName] = useState(
    "Complete React Development Bootcamp"
  );
  const [author, setAuthor] = useState("by Sarah Johnson");
  const [price, setPrice] = useState(74686365654684);
  const [img, setImg] = useState(
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop"
  );

  return (
    <div className="w-80 h-auto mx-auto m-10 bg-white rounded-2xl shadow-2xl">
     <CardDesign height="h-[420px]" width="" img={img} variant="course" title={courseName} description={author} btnName="Enroll" price={price} />
    </div>
  
    
  );
}
