import './index.css'

const NotFound = () => (
  <div className="notfound-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="notfound-image"
    />
    <h1 style={{color: 'white'}}>Page Not Found</h1>
    <p style={{color: 'white'}}>
      We are sorry, the page you requested could not be found
    </p>
  </div>
)
export default NotFound
