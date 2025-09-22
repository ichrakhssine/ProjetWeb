import { useState } from 'react'
import './Header.css'

const Header = ({ showNotification }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery || locationQuery) {
      showNotification(`Recherche: ${searchQuery || 'Tous emplois'} ${locationQuery ? 'à ' + locationQuery : ''}`)
    } else {
      showNotification('Veuillez saisir un critère de recherche')
    }
  }

  return (
    <header>
      <div className="container">
        <div className="header-top">
          <div className="logo">
            <i className="fas fa-rocket"></i>
            Parfait
          </div>
          <div className="auth-buttons">
            <a href="#"><i className="fas fa-sign-in-alt"></i> Connexion</a>
            <a href="#"><i className="fas fa-user-plus"></i> Inscription</a>
          </div>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Fonction, compétences, entreprise"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input 
            type="text" 
            className="search-location" 
            placeholder="Ville, département ou région"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Explorer <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header