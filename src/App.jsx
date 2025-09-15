import { useState } from 'react'
import Header from './components/Header/Header'
import Navigation from './components/Navigation/Navigation'
import JobListings from './components/JobListings/JobListings'
import Filters from './components/Filters/Filters'
import Footer from './components/Footer/Footer'
import Notification from './components/Notification/Notification'
import SpecialEffects from './components/SpecialEffects/SpecialEffects'
import { useSpecialEffects } from './hooks/useSpecialEffects'
import './App.css'

function App() {
  const [notification, setNotification] = useState({ show: false, message: '' })

  // Utiliser le hook d'effets spéciaux
  useSpecialEffects()

  const showNotification = (message) => {
    setNotification({ show: true, message })
    setTimeout(() => setNotification({ show: false, message: '' }), 3000)
  }

  return (
    <div className="App">
      <SpecialEffects />
      <Header showNotification={showNotification} />
      <Navigation />
      <div className="container">
        <div className="main-content">
          <JobListings showNotification={showNotification} />
          <Filters />
        </div>
      </div>
      <Footer />
      <Notification notification={notification} />
    </div>
  )
}

export default App