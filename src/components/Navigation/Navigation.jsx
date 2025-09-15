import './Navigation.css'

const Navigation = () => {
  return (
    <nav>
      <div className="container">
        <ul className="nav-menu">
          <li><a href="#"><i className="fas fa-globe"></i> Emplois</a></li>
          <li><a href="#"><i className="fas fa-building"></i> Entreprises</a></li>
          <li><a href="#"><i className="fas fa-euro-sign"></i> Salaire</a></li>
          <li><a href="#"><i className="fas fa-lightbulb"></i> Conseils</a></li>
          <li><a href="#"><i className="fas fa-calendar-alt"></i> Événements</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation