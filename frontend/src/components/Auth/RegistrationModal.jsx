import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RegistrationModal.css'

const RegistrationModal = ({ onClose, showNotification }) => {
  const [userType, setUserType] = useState(null)
  const navigate = useNavigate()

  const handleCompanyRegistration = (e) => {
    e.preventDefault()
    showNotification('Compte entreprise créé avec succès !')
    
    // Redirection vers la page de publication d'offre
    setTimeout(() => {
      onClose()
      navigate('/publier-offre')
    }, 1500)
  }

  const CandidateForm = () => (
    <form className="registration-form" onSubmit={(e) => {
      e.preventDefault()
      showNotification('Profil candidat créé avec succès !')
      setTimeout(() => onClose(), 1500)
    }}>
      <h3>Inscription Candidat</h3>
      <input type="text" placeholder="Nom complet" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Mot de passe" required />
      <input type="tel" placeholder="Téléphone" />
      <textarea placeholder="Compétences" rows="3"></textarea>
      <input type="text" placeholder="Poste recherché" />
      <button type="submit" className="submit-btn">Créer mon profil</button>
    </form>
  )

  const CompanyForm = () => (
    <form className="registration-form" onSubmit={handleCompanyRegistration}>
      <h3>Inscription Entreprise</h3>
      <input type="text" placeholder="Nom de l'entreprise" required />
      <input type="email" placeholder="Email professionnel" required />
      <input type="password" placeholder="Mot de passe" required />
      <input type="tel" placeholder="Téléphone" />
      <input type="text" placeholder="Secteur d'activité" />
      <input type="text" placeholder="Taille de l'entreprise" />
      <textarea placeholder="Description" rows="3"></textarea>
      <button type="submit" className="submit-btn">Créer le compte entreprise</button>
    </form>
  )

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        {!userType ? (
          <div className="user-type-selection">
            <h2>Choisissez votre profil</h2>
            <div className="user-type-options">
              <button className="user-type-btn candidate" onClick={() => setUserType('candidate')}>
                <i className="fas fa-user-graduate"></i>
                <span>Je suis un Candidat</span>
                <small>Recherche un emploi</small>
              </button>
              <button className="user-type-btn company" onClick={() => setUserType('company')}>
                <i className="fas fa-building"></i>
                <span>Je suis une Entreprise</span>
                <small>Recrute des talents</small>
              </button>
            </div>
          </div>
        ) : (
          <>
            {userType === 'candidate' ? <CandidateForm /> : <CompanyForm />}
            <button className="back-btn" onClick={() => setUserType(null)}>
              ← Retour au choix
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default RegistrationModal