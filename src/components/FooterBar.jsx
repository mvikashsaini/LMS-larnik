import { BookOpen } from "lucide-react";
import { useState } from "react";

export default function FooterBar() {
  const [year, setYear] = useState (2025);
  const [students, setStudents] = useState ('50K+');
  const [courses, setCourses] = useState ('1.2k');
  const [success, setSuccess] = useState ('96%');
  return (
    <footer className="bg-gray-100 text-gray-700 pt-12 ">
      <div className="max-w-7xl mx-auto px-20 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* logo + text  column*/}
        <div>
          <div className="flex items-center mb-4">
            <div className="bg-green-600 p-2 rounded-full">
              
              <BookOpen color="white"/>
            </div>
            <h1 className="ml-3 text-xl font-bold text-green-800">Larnik</h1>
          </div>
          <p className="text-sm mb-6 text-left">
            Empowering learners worldwide with cutting-edge technology, innovative animations, and personalized learning experiences.
          </p>
          <div className="flex gap-6 font-bold text-green-800">
            <div>
              <p className="text-lg">{students}</p>
              <span className="text-xs text-gray-500">Students</span>
            </div>
            <div>
              <p className="text-lg">{courses}</p>
              <span className="text-xs text-gray-500">Courses</span>
            </div>
            <div>
              <p className="text-lg">{success}</p>
              <span className="text-xs text-gray-500">Success</span>
            </div>
          </div>
        </div>

        {/* Platform column */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-black">Platform</h3>
          <ul className="space-y-2">
            <li><a href="/courses">Courses</a></li>
            <li><a href="*">Instructors</a></li>
            <li><a href="*">Certificates</a></li>
            <li><a href="*">For Business</a></li>
          </ul>
        </div>

        {/* Support column */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-black">Support</h3>
          <ul className="space-y-2">
            <li><a href="*">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="*">System Status</a></li>
            <li><a href="*">Community</a></li>
          </ul>
        </div>

        {/* Company column*/}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-black">Company</h3>
          <ul className="space-y-2">
            <li><a href="/about">About</a></li>
            <li><a href="*">Careers</a></li>
            <li><a href="*">Privacy</a></li>
            <li><a href="*">Terms</a></li>
          </ul>
        </div>
      </div>

      {/* line + copyright */}
      <hr class="border-t border-gray-300 mt-5 w-auto  pb-5" />
      <div className="pb-5 text-center text-sm text-gray-500">
        © {year} Larnik LMS. All rights reserved
      </div>
    </footer>
  );
}
