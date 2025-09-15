import JobCard from './JobCard'
import './JobListings.css'

const JobListings = ({ showNotification }) => {
  const jobs = [
    {
      id: 1,
      title: "Développeur Frontend React",
      company: "Tech Solutions SAS",
      location: "Paris 75 • Télétravail partiel",
      salary: "45 000 € - 55 000 € par an",
      contract: "CDI",
      experience: "2-5 ans",
      description: "Nous recherchons un développeur Frontend passionné par React pour rejoindre notre équipe en pleine croissance. Vous travaillerez sur des projets innovants avec des technologies modernes."
    },
    {
      id: 2,
      title: "Designer UX/UI",
      company: "Creative Studio",
      location: "Lyon 69 • Télétravail hybride",
      salary: "38 000 € - 45 000 € par an",
      contract: "CDI",
      experience: "3+ ans",
      description: "Notre studio cherche un designer UX/UI talentueux pour concevoir des interfaces utilisateur exceptionnelles pour nos clients dans divers secteurs."
    },
    {
      id: 3,
      title: "Développeur Full Stack JavaScript",
      company: "Digital Innov",
      location: "Toulouse 31 • Télétravail complet",
      salary: "50 000 € - 65 000 € par an",
      contract: "CDI",
      experience: "4+ ans",
      description: "Rejoignez notre équipe en tant que développeur Full Stack pour travailler sur Node.js, React et AWS. Environnement agile avec des défis techniques stimulants.",
      pulse: true
    }
  ]

  return (
    <div className="job-listings">
      <h2 className="section-title"><i className="fas fa-stars"></i> Offres d'emploi (1245 résultats)</h2>
      
      {jobs.map(job => (
        <JobCard 
          key={job.id} 
          job={job} 
          showNotification={showNotification} 
        />
      ))}
      
      <div className="pagination">
        <a href="#" className="active">1</a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#"><i className="fas fa-chevron-right"></i></a>
      </div>
    </div>
  )
}

export default JobListings