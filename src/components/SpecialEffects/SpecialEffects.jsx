// components/SpecialEffects/SpecialEffects.jsx
import { useEffect } from 'react'
import './SpecialEffects.css'

const SpecialEffects = () => {
  useEffect(() => {
    // Création d'effets de météores aléatoires
    const createMeteor = () => {
      const meteor = document.createElement('div')
      meteor.classList.add('meteor')
      
      // Position aléatoire
      const leftPosition = Math.random() * 100
      meteor.style.left = `${leftPosition}vw`
      
      // Angle aléatoire
      const angle = Math.random() * 20 + 5
      meteor.style.transform = `rotate(${angle}deg)`
      
      // Longueur aléatoire
      const length = Math.random() * 100 + 50
      meteor.style.height = `${length}px`
      
      document.body.appendChild(meteor)
      
      // Animation
      let topPosition = -length
      const speed = Math.random() * 5 + 3
      
      const animateMeteor = setInterval(() => {
        topPosition += speed
        meteor.style.top = `${topPosition}px`
        meteor.style.opacity = '1'
        
        if (topPosition > window.innerHeight) {
          clearInterval(animateMeteor)
          if (meteor.parentNode) {
            meteor.parentNode.removeChild(meteor)
          }
        }
      }, 20)
    }
    
    // Créer des météores à intervalles réguliers
    const meteorInterval = setInterval(createMeteor, 3000)
    
    // Ajouter des étoiles twinkling
    const twinkleStars = () => {
      const stars = document.querySelectorAll('.job-card, .filters, .search-bar')
      stars.forEach(star => {
        if (Math.random() > 0.7) {
          star.style.boxShadow = '0 0 ' + (Math.random() * 15 + 5) + 'px rgba(106, 64, 191, 0.7)'
          
          setTimeout(() => {
            star.style.boxShadow = ''
          }, 300)
        }
      })
    }
    
    const starInterval = setInterval(twinkleStars, 2000)
    
    // Nettoyer les intervalles à la fin
    return () => {
      clearInterval(meteorInterval)
      clearInterval(starInterval)
      
      // Nettoyer les météores existants
      const meteors = document.querySelectorAll('.meteor')
      meteors.forEach(meteor => {
        if (meteor.parentNode) {
          meteor.parentNode.removeChild(meteor)
        }
      })
    }
  }, [])

  // Ce composant ne rend rien visuellement
  return null
}

export default SpecialEffects