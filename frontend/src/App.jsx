import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import LoginModal from './components/Auth/LoginModal'
import RegistrationModal from './components/Auth/RegistrationModal'
import Navigation from './components/Navigation/Navigation'
import JobListings from './components/JobListings/JobListings'
import Filters from './components/Filters/Filters'
import Footer from './components/Footer/Footer'
import Notification from './components/Notification/Notification'
import SpecialEffects from './components/SpecialEffects/SpecialEffects'
import PublierOffre from './components/JobOffer/PublierOffre'
import JobDetails from './components/JobDetails/JobDetails' 
import { useSpecialEffects } from './hooks/useSpecialEffects'
import './App.css'

function App() {
  const [notification, setNotification] = useState({ show: false, message: '' })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    typeEmploi: [],
    experience: [],
    modeTravail: [],
    salaire: []
  })
  const [searchCriteria, setSearchCriteria] = useState({
    query: '',
    location: ''
  })

  useSpecialEffects()

  const showNotification = (message) => {
    setNotification({ show: true, message })
    setTimeout(() => setNotification({ show: false, message: '' }), 3000)
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleRegisterClick = () => {
    setShowRegistrationModal(true)
  }

  const closeModals = () => {
    setShowLoginModal(false)
    setShowRegistrationModal(false)
  }

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters)
    const totalFilters = Object.values(filters).flat().length
    if (totalFilters > 0) {
      showNotification(`${totalFilters} filtre(s) appliqué(s)`)
    }
  }

  const handleSearch = (query, location) => {
    setSearchCriteria({
      query: query.trim(),
      location: location.trim()
    })
    
    let message = 'Recherche: '
    if (query && location) {
      message += `${query} à ${location}`
    } else if (query) {
      message += query
    } else if (location) {
      message += `Tous emplois à ${location}`
    } else {
      message = 'Veuillez saisir un critère de recherche'
    }
    
    showNotification(message)
  }

  // Composant pour la page d'accueil
  const HomePage = () => (
    <>
      <Header 
        showNotification={showNotification}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onSearch={handleSearch}
      />
      <Navigation />
      <div className="container">
        <div className="main-content">
          <JobListings 
            showNotification={showNotification}
            activeFilters={activeFilters}
            searchCriteria={searchCriteria}
          />
          <Filters 
            onFiltersChange={handleFiltersChange}
            showNotification={showNotification}
          />
        </div>
      </div>
      <Footer />
    </>
  )

  return (
    <Router>
      <div className="App">
        <SpecialEffects />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publier-offre" element={<PublierOffre />} />
          {/* utilisation de element au lieu de component */}
          <Route 
            path="/offre/:id" 
            element={<JobDetails showNotification={showNotification} />} 
          />
        </Routes>
      
        {showLoginModal && (
          <LoginModal 
            onClose={closeModals}
            showNotification={showNotification}
          />
        )}
        
        {showRegistrationModal && (
          <RegistrationModal 
            onClose={closeModals}
            showNotification={showNotification}
          />
        )}
        
        <Notification notification={notification} />
      </div>
    </Router>
  )
}

export default App