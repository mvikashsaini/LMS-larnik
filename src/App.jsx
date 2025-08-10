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
import AboutPage from './pages/AboutPage'
import TimelineCard from './components/TimelineCard'
import DiscountBar from './components/DiscountBar'
import TrustedPatner from './components/TrustedPatner'
import SubscriptionPlans from './components/SubscriptionPlans'
import DownloadApp from './components/DownloadApp'
import WhatsappButton from './components/WhatsappButoon'


function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <Navbar />
    <SearchBar />
    <HomePage />
    <AboutPage />
    <div className='flex bg-white'>
    <CourseCard /><CourseCard /><CourseCard />
    <CourseCard />
    </div>
    <TimelineCard />
    <DiscountBar />
    <TrustedPatner />
    <SubscriptionPlans />
    <DownloadApp />
    <FooterBar />
    <WhatsappButton />
    
  </>
  
  )
}

export default App
