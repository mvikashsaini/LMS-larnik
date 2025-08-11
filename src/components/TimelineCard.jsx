import { BookOpen, Users } from "lucide-react";
import React from "react";

export default function TimelineCard() {
  const ArrayData = [
    {
      icon: Users,
      year: "2020",
      title: "Founded",
      description: "Larnik was born from a vision to revolutionize online education",
    },
    {
      icon: Users,
      year: "2020",
      title: "Founded",
      description: "Larnik was born from a vision to revolutionize online education",
    },
    {
      icon: Users,
      year: "2020",
      title: "Founded",
      description: "Larnik was born from a vision to revolutionize online education",
    },
    
  ];


  return (
    <section>
      {ArrayData.map((item, index) => {
        const Icon = item.icon; // dynamic icon
        return (
          <div
            className="m-20 h-32 w-[500px] rounded-2xl shadow-lg bg-white mx-auto"
            key={index}
          >
            <div className="grid grid-cols-2 items-start p-5">
              <div className="flex">
                {/* Icon */}
                <div className='bg-green-800 w-12 h-12 flex items-center justify-center rounded-2xl mt-2'>
                  <Icon className="text-white" />
                </div>

                {/* Year & Title */}
                <div>
                  <h1 className="bg-green-200 rounded-full ml-6 text-xs font-semibold text-green-800  py-0.5">{item.year}</h1>
                  <h1 className="ml-3 text-xl font-bold text-black mt-2">
                    {item.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Description */}
            <h1 className="text-left ml-5 mt-0 text-xs font-semibold text-gray-500">
              {item.description}
            </h1>
          </div>
        );
      })}
    </section>
  );
}
