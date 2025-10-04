import { useState, useEffect } from 'react'
import JobCard from './JobCard'
import './JobListings.css'

const JobListings = ({ showNotification, activeFilters, searchCriteria }) => {
  console.log('📄 JobListings rendu avec searchCriteria:', searchCriteria) // DEBUG

  const [jobs] = useState([
    {
      id: 1,
      title: "Développeur Frontend React",
      company: "Tech Solutions SAS",
      location: "Paris 75 • Télétravail partiel",
      salary: "45 000 € - 55 000 € par an",
      contract: "CDI",
      experience: "2-5 ans",
      mode: "Hybride",
      salaryRange: "40-50k €",
      description: "Nous recherchons un développeur Frontend passionné par React pour rejoindre notre équipe en pleine croissance.",
      tags: ["React", "JavaScript", "Frontend"]
    },
    {
      id: 2,
      title: "Designer UX/UI",
      company: "Creative Studio",
      location: "Lyon 69 • Télétravail hybride",
      salary: "38 000 € - 45 000 € par an",
      contract: "CDI",
      experience: "3+ ans",
      mode: "Hybride",
      salaryRange: "30-40k €",
      description: "Notre studio cherche un designer UX/UI talentueux pour concevoir des interfaces utilisateur exceptionnelles.",
      tags: ["UI/UX", "Design", "Figma"]
    },
    {
      id: 3,
      title: "Développeur Full Stack JavaScript",
      company: "Digital Innov",
      location: "Toulouse 31 • Télétravail complet",
      salary: "50 000 € - 65 000 € par an",
      contract: "CDI",
      experience: "4+ ans",
      mode: "Télétravail complet",
      salaryRange: "50-60k €",
      description: "Rejoignez notre équipe en tant que développeur Full Stack pour travailler sur Node.js, React et AWS.",
      tags: ["JavaScript", "Node.js", "React"],
      pulse: true
    },
    {
      id: 4,
      title: "Stage Développeur Web",
      company: "StartUp Innovante",
      location: "Bordeaux 33 • Présentiel",
      salary: "30 000 € - 35 000 € par an",
      contract: "Stage",
      experience: "Débutant",
      mode: "Présentiel",
      salaryRange: "30-40k €",
      description: "Stage de 6 mois pour apprendre le développement web avec notre équipe expérimentée.",
      tags: ["Stage", "Débutant", "HTML"]
    },
    {
      id: 5,
      title: "Data Scientist Senior",
      company: "Data Analytics Corp",
      location: "Lille 59 • Télétravail hybride",
      salary: "60 000 € - 75 000 € par an",
      contract: "CDI",
      experience: "5+ ans",
      mode: "Hybride",
      salaryRange: "60k+ €",
      description: "Poste de Data Scientist senior pour mener des projets d'analyse de données complexes.",
      tags: ["Data Science", "Python", "Machine Learning"]
    },
    {
      id: 6,
      title: "Développeur Mobile Freelance",
      company: "App Factory",
      location: "Remote • Télétravail complet",
      salary: "Tarif journalier",
      contract: "Freelance",
      experience: "3-5 ans",
      mode: "Télétravail complet",
      salaryRange: "40-50k €",
      description: "Mission freelance pour le développement d'applications mobiles iOS et Android.",
      tags: ["Mobile", "iOS", "Android"]
    }
  ])

  const [filteredJobs, setFilteredJobs] = useState(jobs)
  const [loading, setLoading] = useState(false)

  // Fonction de recherche SIMPLIFIÉE
  const applySearch = (jobsToSearch, search) => {
    if (!search || (!search.query && !search.location)) {
      return jobsToSearch
    }

    const query = search.query?.toLowerCase() || ''
    const location = search.location?.toLowerCase() || ''

    return jobsToSearch.filter(job => {
      const matchesQuery = !query || 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query)))

      const matchesLocation = !location ||
        job.location.toLowerCase().includes(location)

      return matchesQuery && matchesLocation
    })
  }

  // Fonction de filtrage SIMPLIFIÉE
  const applyFilters = (jobsToFilter, filters) => {
    if (!filters || Object.values(filters).flat().length === 0) {
      return jobsToFilter
    }

    return jobsToFilter.filter(job => {
      // Filtre Type d'emploi
      if (filters.typeEmploi && filters.typeEmploi.length > 0) {
        if (!filters.typeEmploi.includes(job.contract)) {
          return false
        }
      }

      // Filtre Expérience
      if (filters.experience && filters.experience.length > 0) {
        let match = false
        if (filters.experience.includes('Débutant') && job.experience === 'Débutant') match = true
        if (filters.experience.includes('1-3 ans') && job.experience === '2-5 ans') match = true
        if (filters.experience.includes('3-5 ans') && (job.experience === '3+ ans' || job.experience === '4+ ans')) match = true
        if (filters.experience.includes('5+ ans') && job.experience === '5+ ans') match = true
        
        if (!match) return false
      }

      // Filtre Mode de travail
      if (filters.modeTravail && filters.modeTravail.length > 0) {
        let match = false
        if (filters.modeTravail.includes('Présentiel') && job.mode === 'Présentiel') match = true
        if (filters.modeTravail.includes('Hybride') && job.mode === 'Hybride') match = true
        if (filters.modeTravail.includes('Télétravail complet') && job.mode === 'Télétravail complet') match = true
        
        if (!match) return false
      }

      // Filtre Salaire
      if (filters.salaire && filters.salaire.length > 0) {
        if (!filters.salaire.includes(job.salaryRange)) {
          return false
        }
      }

      return true
    })
  }

  // useEffect CORRIGÉ - Pas de dépendance à showNotification
  useEffect(() => {
    console.log('🔄 Application recherche + filtres') // DEBUG
    
    setLoading(true)
    
    const timer = setTimeout(() => {
      try {
        // 1. Appliquer la recherche d'abord
        const searchedJobs = applySearch(jobs, searchCriteria)
        console.log('🔍 Après recherche:', searchedJobs.length, 'jobs')
        
        // 2. Appliquer les filtres ensuite
        const filtered = applyFilters(searchedJobs, activeFilters)
        console.log('🎯 Après filtres:', filtered.length, 'jobs')
        
        setFilteredJobs(filtered)
        
      } catch (error) {
        console.error('Erreur recherche/filtrage:', error)
        setFilteredJobs(jobs)
      } finally {
        setLoading(false)
      }
    }, 200) // Délai réduit

    return () => clearTimeout(timer)
  }, [activeFilters, searchCriteria, jobs]) // SUPPRIMÉ showNotification des dépendances

  const handleApplyJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId)
    showNotification(`Candidature envoyée pour ${job.title} chez ${job.company}`)
  }

  const handleSaveJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId)
    showNotification(`Offre sauvegardée : ${job.title}`)
  }

  return (
    <div className="job-listings">
      <div className="job-listings-header">
        <h2 className="section-title">
          <i className="fas fa-briefcase"></i> 
          Offres d'emploi 
          <span className="results-count">
            ({filteredJobs.length} résultat{filteredJobs.length !== 1 ? 's' : ''})
          </span>
        </h2>
        
        {/* Affichage des critères de recherche */}
        {(searchCriteria.query || searchCriteria.location) && (
          <div className="search-results-info">
            <p className="search-criteria">
              {searchCriteria.query && <span>Recherche: "{searchCriteria.query}"</span>}
              {searchCriteria.query && searchCriteria.location && <span> • </span>}
              {searchCriteria.location && <span>Lieu: "{searchCriteria.location}"</span>}
            </p>
          </div>
        )}
        
        <p className="subtitle">Découvrez les meilleures opportunités de carrière</p>
      </div>

      {loading ? (
        <div className="loading-jobs">
          <div className="loading-spinner"></div>
          <p>Recherche en cours...</p>
        </div>
      ) : (
        <>
          {filteredJobs.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>Aucune offre ne correspond à vos critères</h3>
              <p>Essayez de modifier votre recherche ou vos filtres</p>
            </div>
          ) : (
            <div className="job-cards-container">
              {filteredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  showNotification={showNotification}
                  onApply={handleApplyJob}
                  onSave={handleSaveJob}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default JobListings