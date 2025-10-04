import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './JobDetails.css'

const JobDetails = ({ showNotification }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [applicationForm, setApplicationForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    lettreMotivation: '',
    cv: null
  })

  // Données simulées - En pratique, vous récupéreriez depuis une API
  const job = {
    id: 1,
    title: "Développeur Frontend React",
    company: "Tech Solutions SAS",
    location: "Paris 75 • Télétravail partiel",
    salary: "45 000 € - 55 000 € par an",
    contract: "CDI",
    experience: "2-5 ans",
    mode: "Hybride",
    salaryRange: "40-50k €",
    description: "Nous recherchons un développeur Frontend passionné par React pour rejoindre notre équipe en pleine croissance. Vous travaillerez sur des projets innovants avec des technologies modernes.",
    missions: [
      "Développer de nouvelles fonctionnalités frontend avec React",
      "Collaborer avec l'équipe design pour créer des interfaces utilisateur exceptionnelles",
      "Participer aux revues de code et aux améliorations continues",
      "Optimiser les performances des applications"
    ],
    competences: ["React", "JavaScript", "HTML5", "CSS3", "Git", "Agile"],
    avantages: [
      "Mutuelle entreprise 100% prise en charge",
      "Tickets restaurant",
      "Remote partiel",
      "Équipement fourni",
      "Formations continues"
    ],
    datePublication: "15 janvier 2024",
    dateLimite: "15 février 2024"
  }

  const handleInputChange = (field, value) => {
    setApplicationForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      handleInputChange('cv', file)
      showNotification('CV uploadé avec succès')
    } else {
      showNotification('Veuillez sélectionner un fichier PDF')
    }
  }

  const handleSubmitApplication = (e) => {
    e.preventDefault()
    
    // Validation
    if (!applicationForm.nom || !applicationForm.email || !applicationForm.lettreMotivation) {
      showNotification('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Simulation d'envoi
    showNotification('Candidature envoyée avec succès !')
    
    // Redirection après 2 secondes
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  return (
    <div className="job-details-container">
      <div className="container">
        {/* Header avec bouton retour */}
        <div className="job-details-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i> Retour aux offres
          </button>
          <h1>Détails de l'offre</h1>
        </div>

        <div className="job-details-content">
          {/* Section détails de l'offre */}
          <div className="job-info-section">
            <div className="job-header">
              <div className="job-title-section">
                <h2>{job.title}</h2>
                <span className="company-badge">{job.company}</span>
              </div>
              <div className="job-meta">
                <span className="salary-highlight">{job.salary}</span>
                <span className="urgent-badge">URGENT</span>
              </div>
            </div>

            {/* Informations principales */}
            <div className="job-main-info">
              <div className="info-grid">
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{job.location}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-file-contract"></i>
                  <span>{job.contract}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-briefcase"></i>
                  <span>Expérience: {job.experience}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-laptop-house"></i>
                  <span>{job.mode}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h3><i className="fas fa-align-left"></i> Description du poste</h3>
              <p>{job.description}</p>
            </div>

            {/* Missions */}
            <div className="missions-section">
              <h3><i className="fas fa-tasks"></i> Missions principales</h3>
              <ul>
                {job.missions.map((mission, index) => (
                  <li key={index}>{mission}</li>
                ))}
              </ul>
            </div>

            {/* Compétences */}
            <div className="skills-section">
              <h3><i className="fas fa-code"></i> Compétences recherchées</h3>
              <div className="skills-tags">
                {job.competences.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            {/* Avantages */}
            <div className="benefits-section">
              <h3><i className="fas fa-gift"></i> Avantages</h3>
              <ul>
                {job.avantages.map((avantage, index) => (
                  <li key={index}>{avantage}</li>
                ))}
              </ul>
            </div>

            {/* Dates */}
            <div className="dates-section">
              <div className="date-item">
                <strong>Publiée le:</strong> {job.datePublication}
              </div>
              <div className="date-item">
                <strong>Date limite:</strong> {job.dateLimite}
              </div>
            </div>
          </div>

          {/* Formulaire de candidature */}
          <div className="application-section">
            <div className="application-form-container">
              <h3><i className="fas fa-paper-plane"></i> Postuler à cette offre</h3>
              
              <form onSubmit={handleSubmitApplication} className="application-form">
                <div className="form-group">
                  <label htmlFor="nom">Nom complet *</label>
                  <input
                    id="nom"
                    type="text"
                    value={applicationForm.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={applicationForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    id="telephone"
                    type="tel"
                    value={applicationForm.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lettreMotivation">Lettre de motivation *</label>
                  <textarea
                    id="lettreMotivation"
                    value={applicationForm.lettreMotivation}
                    onChange={(e) => handleInputChange('lettreMotivation', e.target.value)}
                    placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                    rows="6"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cv">CV (PDF uniquement) *</label>
                  <div className="file-upload">
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <label htmlFor="cv" className="file-label">
                      <i className="fas fa-upload"></i>
                      {applicationForm.cv ? applicationForm.cv.name : 'Choisir un fichier PDF'}
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-application-btn">
                  <i className="fas fa-paper-plane"></i>
                  Envoyer ma candidature
                </button>

                <p className="form-note">
                  * Champs obligatoires. Votre candidature sera directement envoyée au recruteur.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetails