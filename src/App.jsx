// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Navbar from './components/Navbar'
// import CourseCard from './components/Coursecard'
// import HomePage from './pages/HomePage'
// import SearchBar from './components/SearchBar'
// import Footer from './components/FooterBar'
// import FooterBar from './components/FooterBar'
// import AboutPage from './pages/AboutPage'
// import TimelineCard from './components/TimelineCard'
// import DiscountBar from './components/DiscountBar'
// import TrustedPatner from './components/TrustedPatner'
// import SubscriptionPlans from './components/SubscriptionPlans'
// import DownloadApp from './components/DownloadApp'
// import WhatsappButton from './components/WhatsappButoon'
// import CardDesign from './components/CradDesign'
// import LogIn from './pages/Login'
// import SignUp from './pages/SignUp'
// import ContactPage from './pages/ContactPage'
// import CoursePage from './components/CoursePage'
// import AdminPage from './pages/AdminPage'
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import { div } from 'framer-motion/client'


// function App() {


//   return (

        


//      <Router>
//       {/* Simple Navbar */}
//       <nav className="flex gap-4 p-4 bg-gray-100 shadow">
//         <Link to="/" className="hover:text-blue-500">Home</Link>
//         {/* <Link to="/about" className="hover:text-blue-500">About</Link>
//         <Link to="/contact" className="hover:text-blue-500">Contact</Link> */}
//       </nav>

//       {/* Page Routes */}
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         {/* <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} /> */}
//       </Routes>
//     </Router>
      
  
  
//   )
// }

// export default App

import { Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/HomePage'
import Navbar from "./components/Navbar";
import FooterBar from "./components/FooterBar";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LogIn from "./pages/Login";
import SignUp from "./pages/SignUp";
import SearchBar from "./components/SearchBar";
import WhatsappButoon from "./components/WhatsappButoon";
import CoursePage from "./pages/CoursePage";
import { div } from "framer-motion/client";

export default function App() {

  const hiddenRoutes = ["/admin", "/login", "/signup"];

  return (
    <div>
      {!hiddenRoutes.includes(location.pathname) && (
       <div>
         <Navbar />
         <SearchBar />
      <WhatsappButoon />
       </div>
      )}
      {/* Routes */}
      <div>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/courses" element={<CoursePage />} />
        {/* Catch-all 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      </div>
      {!hiddenRoutes.includes(location.pathname) && (
       <div>
         <FooterBar />
       </div>
      )}
      
    </div>
  );
}
