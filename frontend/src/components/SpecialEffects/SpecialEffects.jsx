import React from 'react'
import './SpecialEffects.css'

const SpecialEffects = () => {
  React.useEffect(() => {
    // Créer des étoiles dynamiquement
    const starsContainer = document.querySelector('.stars')
    if (starsContainer) {
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = `${Math.random() * 100}%`
        star.style.top = `${Math.random() * 100}%`
        star.style.width = `${Math.random() * 2 + 1}px`
        star.style.height = star.style.width
        star.style.animationDelay = `${Math.random() * 5}s`
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`)
        starsContainer.appendChild(star)
      }
    }
  }, [])

  return (
    <>
      <div className="Parfait"></div>
      <div className="stars"></div>
    </>
  )
}

export default SpecialEffects