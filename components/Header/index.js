import {Link, withRouter} from 'react-router-dom'
import Cookie from 'js-cookie'

import './index.css'

const Header = props => {
  const clickLogout = () => {
    Cookie.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu">
          <li className="list">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="list">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>
        <div className="buttons">
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={clickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
export default withRouter(Header)
