import './Filters.css'

const Filters = () => {
  return (
    <div className="filters">
      <h2 className="section-title"><i className="fas fa-filter"></i> Filtres</h2>
      
      <div className="filter-group">
        <h3><i className="fas fa-file-contract"></i> Type d'emploi</h3>
        <div className="filter-options">
          <label><input type="checkbox" /> CDI</label>
          <label><input type="checkbox" /> CDD</label>
          <label><input type="checkbox" /> Stage</label>
          <label><input type="checkbox" /> Freelance</label>
        </div>
      </div>
      
      <div className="filter-group">
        <h3><i className="fas fa-chart-line"></i> Niveau d'expérience</h3>
        <div className="filter-options">
          <label><input type="checkbox" /> Débutant</label>
          <label><input type="checkbox" /> 1-3 ans</label>
          <label><input type="checkbox" /> 3-5 ans</label>
          <label><input type="checkbox" /> 5+ ans</label>
        </div>
      </div>
      
      <div className="filter-group">
        <h3><i className="fas fa-laptop-house"></i> Mode de travail</h3>
        <div className="filter-options">
          <label><input type="checkbox" /> Présentiel</label>
          <label><input type="checkbox" /> Hybride</label>
          <label><input type="checkbox" /> Télétravail complet</label>
        </div>
      </div>
      
      <div className="filter-group">
        <h3><i className="fas fa-money-bill-wave"></i> Salaire estimé</h3>
        <div className="filter-options">
          <label><input type="checkbox" /> 30-40k €</label>
          <label><input type="checkbox" /> 40-50k €</label>
          <label><input type="checkbox" /> 50-60k €</label>
          <label><input type="checkbox" /> 60k+ €</label>
        </div>
      </div>
    </div>
  )
}

export default Filters