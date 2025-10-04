import './Navigation.css'

const Navigation = () => {
  // Fonction pour gérer les clics (exemple)
  const handleNavClick = (section) => {
    console.log(`Navigation vers: ${section}`);
    // Ici vous pouvez ajouter votre logique de navigation
    // Par exemple: router.push(`/${section}`)
  };

  return (
    <nav>
      <div className="container">
        <ul className="nav-menu">
          <li>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('entreprises');
              }}
              className="nav-link"
            >
              <i className="fas fa-building"></i>
              <span>Entreprises</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('evenements');
              }}
              className="nav-link"
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Événements</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation