import { useState } from 'react'

const JobCard = ({ job, showNotification }) => {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(!saved)
    showNotification(saved ? 'Offre retirée des favoris' : 'Offre sauvegardée avec succès!')
  }

  return (
    <div className="job-card">
      <h3 className="job-title"><i className="fas fa-laptop-code"></i> {job.title}</h3>
      <p className="company"><i className="fas fa-building"></i> {job.company}</p>
      <p className="location"><i className="fas fa-map-marker-alt"></i> {job.location}</p>
      <div className="job-details">
        <span className="salary"><i className="fas fa-euro-sign"></i> {job.salary}</span>
        <span><i className="fas fa-file-contract"></i> {job.contract}</span>
        <span><i className="fas fa-briefcase"></i> Expérience: {job.experience}</span>
      </div>
      <p className="job-description">{job.description}</p>
      <div className="job-actions">
        <span className={`save-job ${saved ? 'saved' : ''}`} onClick={handleSave}>
          <i className={saved ? "fas fa-bookmark" : "far fa-bookmark"}></i> 
          {saved ? 'Sauvegardé' : 'Sauvegarder'}
        </span>
        <a href="#" className={`apply-button ${job.pulse ? 'pulse' : ''}`}>
          Postuler <i className="fas fa-paper-plane"></i>
        </a>
      </div>
    </div>
  )
}

export default JobCard