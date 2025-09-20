import './Notification.css'

const Notification = ({ notification }) => {
  return (
    <div className={`notification ${notification.show ? 'show' : ''}`}>
      <i className="fas fa-check-circle"></i> 
      <span>{notification.message}</span>
    </div>
  )
}

export default Notification