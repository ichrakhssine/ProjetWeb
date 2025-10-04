import { useState } from 'react'
import './Filters.css'

const Filters = ({ onFiltersChange, showNotification }) => {
  console.log('🔧 Filters component mounted')
  
  const [filters, setFilters] = useState({
    typeEmploi: [],
    experience: [],
    modeTravail: [],
    salaire: []
  })

  // Options des filtres
  const typeEmploiOptions = ['CDI', 'CDD', 'Stage', 'Freelance']
  const experienceOptions = ['Débutant', '1-3 ans', '3-5 ans', '5+ ans']
  const modeTravailOptions = ['Présentiel', 'Hybride', 'Télétravail complet']
  const salaireOptions = ['30-40k €', '40-50k €', '50-60k €', '60k+ €']

  // Gérer le changement des cases à cocher
  const handleCheckboxChange = (category, value) => {
    console.log('✅ Checkbox cliquée:', category, value)
    
    setFilters(prev => {
      const newFilters = { ...prev }
      
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value)
      } else {
        newFilters[category] = [...newFilters[category], value]
      }
      
      console.log('🔄 Nouveaux filtres:', newFilters)
      
      // Notifier le parent
      if (onFiltersChange) {
        onFiltersChange(newFilters)
      }
      
      return newFilters
    })
  }

  // Réinitialiser tous les filtres - CORRIGÉ
  const resetFilters = () => {
    console.log('🔄 Réinitialisation des filtres')
    const emptyFilters = {
      typeEmploi: [],
      experience: [],
      modeTravail: [],
      salaire: []
    }
    
    setFilters(emptyFilters)
    
    if (onFiltersChange) {
      onFiltersChange(emptyFilters)
    }
    
    if (showNotification) {
      showNotification('Filtres réinitialisés')
    }
  }

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters = Object.values(filters).flat().length > 0

  return (
    <div className="filters">
      <div className="filters-header">
        <h2 className="section-title">
          <i className="fas fa-filter"></i> Filtres
        </h2>
        
        {/* BOUTON RÉINITIALISER CORRIGÉ - VRAI BOUTON */}
         <button 
          className={`reset-filters-btn ${!hasActiveFilters ? 'disabled' : ''}`}
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          type="button" // Important pour éviter la soumission de formulaire
        >
          <i className="fas fa-redo"></i> Réinitialiser
        </button>
      
      </div>
      
      {/* Compteur de filtres actifs */}
      <div className="active-filters-count">
        {hasActiveFilters ? (
          <span className="active-count">
            {Object.values(filters).flat().length} filtre(s) actif(s)
          </span>
        ) : (
          <span className="no-filters">Aucun filtre actif</span>
        )}
      </div>
      
      {/* Type d'emploi */}
      <div className="filter-group">
        <h3><i className="fas fa-file-contract"></i> Type d'emploi</h3>
        <div className="filter-options">
          {typeEmploiOptions.map(option => (
            <label key={option} className="filter-option">
              <input 
                type="checkbox" 
                checked={filters.typeEmploi.includes(option)}
                onChange={() => handleCheckboxChange('typeEmploi', option)}
              />
              <span className="checkmark"></span>
              {option}
            </label>
          ))}
        </div>
      </div>
      
      {/* Expérience */}
      <div className="filter-group">
        <h3><i className="fas fa-chart-line"></i> Niveau d'expérience</h3>
        <div className="filter-options">
          {experienceOptions.map(option => (
            <label key={option} className="filter-option">
              <input 
                type="checkbox" 
                checked={filters.experience.includes(option)}
                onChange={() => handleCheckboxChange('experience', option)}
              />
              <span className="checkmark"></span>
              {option}
            </label>
          ))}
        </div>
      </div>
      
      {/* Mode de travail */}
      <div className="filter-group">
        <h3><i className="fas fa-laptop-house"></i> Mode de travail</h3>
        <div className="filter-options">
          {modeTravailOptions.map(option => (
            <label key={option} className="filter-option">
              <input 
                type="checkbox" 
                checked={filters.modeTravail.includes(option)}
                onChange={() => handleCheckboxChange('modeTravail', option)}
              />
              <span className="checkmark"></span>
              {option}
            </label>
          ))}
        </div>
      </div>
      
      {/* Salaire */}
      <div className="filter-group">
        <h3><i className="fas fa-money-bill-wave"></i> Salaire estimé</h3>
        <div className="filter-options">
          {salaireOptions.map(option => (
            <label key={option} className="filter-option">
              <input 
                type="checkbox" 
                checked={filters.salaire.includes(option)}
                onChange={() => handleCheckboxChange('salaire', option)}
              />
              <span className="checkmark"></span>
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Bouton de réinitialisation supplémentaire en bas */}
      {hasActiveFilters && (
        <div className="reset-bottom">
          <button 
            className="reset-filters-btn large"
            onClick={resetFilters}
            type="button"
          >
            <i className="fas fa-redo"></i> Réinitialiser tous les filtres
          </button>
        </div>
      )}
    </div>
  )
}

export default Filters