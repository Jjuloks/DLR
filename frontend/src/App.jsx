import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Footer from './components/Footer/Footer'
import ContactSection from './pages/ContactSection/ContactSection'
import CalendarSection from './pages/Calendar/Calendar'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
        <div className="app-content"> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarSection />} />
        <Route path="/contact" element={<ContactSection />} />
      </Routes>   
      </div>   
<Footer />
    </>
  )
}