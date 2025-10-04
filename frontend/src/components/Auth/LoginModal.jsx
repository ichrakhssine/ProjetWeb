import { useState } from 'react'
import './LoginModal.css'

const LoginModal = ({ onClose, showNotification }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // la logique de connexion
    showNotification('Connexion en cours...')
    // Simuler une connexion
    setTimeout(() => {
      showNotification('Connexion réussie !')
      onClose()
    }, 1000)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Connexion</h2>
          <input 
            type="email" 
            placeholder="Email" 
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required 
          />
          <button type="submit" className="submit-btn">Se connecter</button>
          <p className="forgot-password">Mot de passe oublié ?</p>
        </form>
      </div>
    </div>
  )
}

export default LoginModal