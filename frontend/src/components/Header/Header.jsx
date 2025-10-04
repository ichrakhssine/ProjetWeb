import { useState, useRef, useEffect } from 'react'
import './Header.css'

const Header = ({ showNotification, onLoginClick, onRegisterClick, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Liste des villes principales françaises
  const frenchCities = [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", 
    "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne",
    "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Clermont-Ferrand",
    "Le Mans", "Aix-en-Provence", "Brest", "Tours", "Amiens", "Limoges", "Annecy",
    "Perpignan", "Boulogne-Billancourt", "Metz", "Besançon", "Orléans", "Rouen",
    "Mulhouse", "Caen", "Saint-Denis", "Argenteuil", "Montreuil", "Nancy", "Tourcoing",
    "Nanterre", "Avignon", "Vitry-sur-Seine", "Créteil", "Dunkerque", "Poitiers",
    "Asnières-sur-Seine", "Courbevoie", "Versailles", "Colombes", "Fort-de-France",
    "Aulnay-sous-Bois", "Saint-Pierre", "Rueil-Malmaison", "Pau", "Aubervilliers",
    "La Rochelle", "Champigny-sur-Marne", "Antibes", "Saint-Maur-des-Fossés", "Cannes",
    "Calais", "Beziers", "Colmar", "Bourges", "Drancy", "Mérignac", "Saint-Nazaire",
    "Valence", "Ajaccio", "Issy-les-Moulineaux", "Vénissieux", "Noisy-le-Grand",
    "Cergy", "Levallois-Perret", "La Seyne-sur-Mer", "Quimper", "Antony", "Troyes",
    "Ivry-sur-Seine", "Clichy", "Chambéry", "Lorient", "Les Abymes", "Montauban",
    "Sarcelles", "Niort", "Villejuif", "Hyères", "Saint-André", "Saint-Quentin",
    "Beauvais", "Épinay-sur-Seine", "Cayenne", "Maisons-Alfort", "Meaux", "Chelles",
    "Pantin", "Évry", "Fontenay-sous-Bois", "Frèjus", "Vannes", "Bondy", "Le Blanc-Mesnil",
    "La Roche-sur-Yon", "Saint-Louis", "Arles", "Clamart", "Narbonne", "Annecy",
    "Sartrouville", "Grasse", "Laval", "Belfort", "Bobigny", "Évreux", "Vincennes",
    "Remote", "Télétravail"
  ]

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = () => {
    console.log('🔍 Recherche lancée:', { searchQuery, locationQuery }) // DEBUG
    if (searchQuery || locationQuery) {
      if (onSearch) {
        onSearch(searchQuery, locationQuery)
      }
      setShowCityDropdown(false)
    } else {
      showNotification('Veuillez saisir un critère de recherche')
    }
  }

  // Recherche avec la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Sélection d'une ville depuis la liste
  const handleCitySelect = (city) => {
    console.log('🏙️ Ville sélectionnée:', city) // DEBUG
    setLocationQuery(city)
    setShowCityDropdown(false)
    // Recherche automatique quand on sélectionne une ville
    if (onSearch) {
      onSearch(searchQuery, city)
    }
  }

  // Filtrer les villes selon la saisie
  const filteredCities = frenchCities.filter(city =>
    city.toLowerCase().includes(locationQuery.toLowerCase())
  ).slice(0, 8) // Limiter à 8 résultats

  console.log('🔍 Villes filtrées:', filteredCities) // DEBUG
  console.log('📱 Dropdown visible:', showCityDropdown) // DEBUG

  return (
    <header>
      <div className="container">
        <div className="header-top">
          <div className="logo">
            <i className="fas fa-rocket"></i>
            Parfait
          </div>
          <div className="auth-buttons">
            <button className="auth-link" onClick={onLoginClick}>
              <i className="fas fa-sign-in-alt"></i> Connexion
            </button>
            <button className="auth-link" onClick={onRegisterClick}>
              <i className="fas fa-user-plus"></i> Inscription
            </button>
          </div>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Fonction, compétences, entreprise"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          {/* Sélecteur de villes avec dropdown */}
          <div className="location-input-container" ref={dropdownRef}>
            <input 
              type="text" 
              className="search-location" 
              placeholder="Ville, département ou région"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value)
                setShowCityDropdown(true)
              }}
              onFocus={() => {
                console.log('📍 Focus sur input ville') // DEBUG
                setShowCityDropdown(true)
              }}
              onKeyPress={handleKeyPress}
            />
            
            {showCityDropdown && (
              <div className="city-dropdown">
                {filteredCities.length > 0 ? (
                  filteredCities.map(city => (
                    <div 
                      key={city}
                      className="city-option"
                      onClick={() => handleCitySelect(city)}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="city-option no-results">
                    <i className="fas fa-search"></i>
                    Aucune ville trouvée
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button className="search-button" onClick={handleSearch}>
            Explorer <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header