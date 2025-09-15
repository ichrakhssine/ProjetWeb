import './Footer.css'

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3><i className="fas fa-rocket"></i> GalaxyJobs</h3>
            <ul>
              <li><i className="fas fa-info-circle"></i> <a href="#">À propos de nous</a></li>
              <li><i className="fas fa-envelope"></i> <a href="#">Contact</a></li>
              <li><i className="fas fa-briefcase"></i> <a href="#">Carrières</a></li>
              <li><i className="fas fa-blog"></i> <a href="#">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3><i className="fas fa-building"></i> Employeurs</h3>
            <ul>
              <li><i className="fas fa-plus-circle"></i> <a href="#">Publier une offre</a></li>
              <li><i className="fas fa-search"></i> <a href="#">Rechercher des CV</a></li>
              <li><i className="fas fa-tools"></i> <a href="#">Solutions de recrutement</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3><i className="fas fa-book"></i> Ressources</h3>
            <ul>
              <li><i className="fas fa-question-circle"></i> <a href="#">Aide</a></li>
              <li><i className="fas fa-shield-alt"></i> <a href="#">Centre de sécurité</a></li>
              <li><i className="fas fa-gavel"></i> <a href="#">Mentions légales</a></li>
              <li><i className="fas fa-lock"></i> <a href="#">Politique de confidentialité</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3><i className="fas fa-share-alt"></i> Nous suivre</h3>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div className="copyright">
          <p>© 2023 GalaxyJobs - Tous droits réservés | Explorez l'univers des opportunités professionnelles</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer