import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './JobCard.css'

const JobCard = ({ job, showNotification, onSave }) => {
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  const handleSave = () => {
    setSaved(!saved)
    if (onSave) {
      onSave(job.id)
    }
    showNotification(saved ? 'Offre retirée des favoris' : 'Offre sauvegardée avec succès!')
  }

  const handleViewDetails = () => {
    console.log('🔍 Navigation vers détails de l\'offre:', job.id) // DEBUG
    navigate(`/offre/${job.id}`)
  }

  return (
    <div className={`job-card ${job.pulse ? 'pulse-highlight' : ''}`}>
      <div className="job-card-header">
        <h3 className="job-title">
          <i className="fas fa-laptop-code"></i> 
          {job.title}
        </h3>
        {job.pulse && <span className="urgent-badge">URGENT</span>}
      </div>

      <div className="job-basic-info">
        <p className="company">
          <i className="fas fa-building"></i> 
          {job.company}
        </p>
        <p className="location">
          <i className="fas fa-map-marker-alt"></i> 
          {job.location}
        </p>
      </div>

      <div className="job-details">
        <span className="detail-item salary">
          <i className="fas fa-euro-sign"></i> 
          {job.salary}
        </span>
        <span className="detail-item contract">
          <i className="fas fa-file-contract"></i> 
          {job.contract}
        </span>
        <span className="detail-item experience">
          <i className="fas fa-briefcase"></i> 
          {job.experience}
        </span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-actions">
        <button 
          className={`save-button ${saved ? 'saved' : ''}`} 
          onClick={handleSave}
        >
          <i className={saved ? "fas fa-bookmark" : "far fa-bookmark"}></i> 
          {saved ? 'Sauvegardé' : 'Sauvegarder'}
        </button>
        
        <button 
          className={`apply-button ${job.pulse ? 'pulse' : ''}`}
          onClick={handleViewDetails}
        >
          Voir détails <i className="fas fa-eye"></i>
        </button>
      </div>
    </div>
  )
}

export default JobCard