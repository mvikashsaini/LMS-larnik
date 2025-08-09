import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import CourseCard from './components/Coursecard'
import HomePage from './pages/HomePage'
import SearchBar from './components/SearchBar'
import Footer from './components/FooterBar'
import FooterBar from './components/FooterBar'
// import AboutPage from './pages/AboutPage'


function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <Navbar />
    {/* <AboutPage /> */}
    <HomePage />
    <SearchBar />
    <div className='flex bg-white'>
    <CourseCard /><CourseCard /><CourseCard />
    <CourseCard />
    </div>
    <FooterBar />
    
  </>
  
  )
}

export default App
