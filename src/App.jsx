import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import CourseCard from './components/Coursecard'
import HomePage from './pages/HomePage'


function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <Navbar />
    <HomePage />
    <CourseCard />
  </>
  
  )
}

export default App
