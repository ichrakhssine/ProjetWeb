import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PublierOffre.css'

const PublierOffre = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [competenceInput, setCompetenceInput] = useState('')
  
  const [formData, setFormData] = useState({
    titre: '',
    entreprise: '',
    description: '',
    secteur: '',
    type_contrat: 'CDI',
    localisation: '',
    salaire_min: '',
    salaire_max: '',
    competences: [],
    experience: '',
    teletravail_possible: false,
    contact_email: '',
    date_limite: ''
  })

  const secteurs = [
    'Informatique', 'Marketing', 'Finance', 'Ressources Humaines', 
    'Vente', 'Engineering', 'Design', 'Juridique', 'Santé', 'Education', 'Autre'
  ]

  const typesContrat = ['CDI', 'CDD', 'Stage', 'Freelance', 'Temps partiel']
  const niveauxExperience = ['Junior (0-2 ans)', 'Confirmé (3-5 ans)', 'Senior (5+ ans)', 'Sans expérience']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const ajouterCompetence = () => {
    if (competenceInput.trim() && !formData.competences.includes(competenceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        competences: [...prev.competences, competenceInput.trim()]
      }))
      setCompetenceInput('')
    }
  }

  const supprimerCompetence = (competence) => {
    setFormData(prev => ({
      ...prev,
      competences: prev.competences.filter(c => c !== competence)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simuler la création de l'offre
      console.log('Offre créée:', formData)
      
      // Redirection après succès
      setTimeout(() => {
        setIsLoading(false)
        navigate('/offres') // Rediriger vers la liste des offres
      }, 2000)
    } catch (error) {
      console.error('Erreur lors de la création de l\'offre:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="publier-offre-container">
      <div className="publier-offre-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Retour
        </button>
        <h1>Publier une offre d'emploi</h1>
        <p>Trouvez le candidat idéal pour votre entreprise</p>
      </div>

      <div className="publier-offre-form">
        <form onSubmit={handleSubmit}>
          {/* Informations de base */}
          <div className="form-section">
            <h2>Informations de base</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="titre">Titre du poste *</label>
                <input
                  id="titre"
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  placeholder="ex: Développeur Full Stack Senior"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="entreprise">Nom de l'entreprise *</label>
                <input
                  id="entreprise"
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => handleInputChange('entreprise', e.target.value)}
                  placeholder="ex: TechCorp"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description du poste *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez les missions, responsabilités et profil recherché..."
                rows={6}
                required
              />
            </div>
          </div>

          {/* Détails du poste */}
          <div className="form-section">
            <h2>Détails du poste</h2>
            <div className="form-grid-3">
              <div className="form-group">
                <label htmlFor="secteur">Secteur *</label>
                <select 
                  id="secteur"
                  value={formData.secteur}
                  onChange={(e) => handleInputChange('secteur', e.target.value)}
                  required
                >
                  <option value="">Choisir un secteur</option>
                  {secteurs.map(secteur => (
                    <option key={secteur} value={secteur}>{secteur}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="type_contrat">Type de contrat</label>
                <select 
                  id="type_contrat"
                  value={formData.type_contrat}
                  onChange={(e) => handleInputChange('type_contrat', e.target.value)}
                >
                  {typesContrat.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="localisation">Localisation *</label>
                <input
                  id="localisation"
                  type="text"
                  value={formData.localisation}
                  onChange={(e) => handleInputChange('localisation', e.target.value)}
                  placeholder="ex: Paris, Lyon, Remote..."
                  required
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label htmlFor="salaire_min">Salaire minimum (€)</label>
                <input
                  id="salaire_min"
                  type="number"
                  value={formData.salaire_min}
                  onChange={(e) => handleInputChange('salaire_min', e.target.value)}
                  placeholder="ex: 40000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaire_max">Salaire maximum (€)</label>
                <input
                  id="salaire_max"
                  type="number"
                  value={formData.salaire_max}
                  onChange={(e) => handleInputChange('salaire_max', e.target.value)}
                  placeholder="ex: 55000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">Niveau d'expérience</label>
                <select 
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                >
                  <option value="">Choisir un niveau</option>
                  {niveauxExperience.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Compétences */}
          <div className="form-section">
            <h2>Compétences requises</h2>
            <div className="competences-input">
              <input
                type="text"
                value={competenceInput}
                onChange={(e) => setCompetenceInput(e.target.value)}
                placeholder="Ajouter une compétence..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), ajouterCompetence())}
              />
              <button type="button" onClick={ajouterCompetence}>+</button>
            </div>
            
            {formData.competences.length > 0 && (
              <div className="competences-list">
                {formData.competences.map((competence) => (
                  <span key={competence} className="competence-tag">
                    {competence}
                    <button type="button" onClick={() => supprimerCompetence(competence)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Informations supplémentaires */}
          <div className="form-section">
            <h2>Informations supplémentaires</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contact_email">Email de contact</label>
                <input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="contact@entreprise.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date_limite">Date limite de candidature</label>
                <input
                  id="date_limite"
                  type="date"
                  value={formData.date_limite}
                  onChange={(e) => handleInputChange('date_limite', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.teletravail_possible}
                  onChange={(e) => handleInputChange('teletravail_possible', e.target.checked)}
                />
                Télétravail possible
              </label>
            </div>
          </div>

          {/* Boutons */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} disabled={isLoading}>
              Annuler
            </button>
            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? 'Publication...' : 'Publier l\'offre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublierOffre